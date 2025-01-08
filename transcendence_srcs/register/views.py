from django.shortcuts import render, redirect, get_object_or_404 # type: ignore
# from api.models import User_tab, User_tabManager
from django.contrib.auth import get_user_model, login # type: ignore# type: ignore
from django.contrib import messages # type: ignore
from frontend.models import TextTranslation
from django.utils.translation import get_language # type: ignore
from django.core.mail import EmailMultiAlternatives # type: ignore
from django.utils.crypto import get_random_string # type: ignore
from django.urls import reverse # type: ignore
from django.conf import settings # type: ignore
from django.http import HttpResponse # type: ignore
from django.http import JsonResponse # type: ignore
from django.template.loader import render_to_string # type: ignore
from django.utils.html import strip_tags # type: ignore
from frontend.models import TextTranslation

User = get_user_model()

def send_verification_email(user, lang):
	# Créer le lien d'activation
	verification_link = f"{settings.SITE_URL}{reverse('verify_email')}?token={user.verification_token}&username={user.username}"

	translations = TextTranslation.objects.filter(Lang=lang)
	texts_trans = {trans.Key : trans.Text for trans in translations}

	# Charger le template HTML
	html_content = render_to_string('emails/verification_email.html', {
		'user': user,
		'verification_link': verification_link,
		'texts': texts_trans,
	})

	# Extraire le texte brut depuis le HTML (fallback pour les clients email simples)
	text_content = strip_tags(html_content)

	subject_text = "Vérifiez votre adresse email"
	if lang == 'en':
		subject_text = "Check your email address"
	elif lang == 'es':
		subject_text = "Compruebe su dirección de correo electrónico"

	# Préparer l'email
	email = EmailMultiAlternatives(
		subject=subject_text,
		body=text_content,  # version texte brut
		from_email=settings.DEFAULT_FROM_EMAIL,
		to=[user.Email],
	)

	# Ajouter la version HTML
	email.attach_alternative(html_content, "text/html")

	# Envoyer l'email
	email.send()

def verify_email(request):
	token = request.GET.get('token')
	username = request.GET.get('username')
	user = get_object_or_404(User, username=username)
	# Vérification du token
	if str(user.verification_token) == token:
		user.is_email_verified = True
		user.is_active = True  # Activez le compte de l'utilisateur
		user.save()
		login(request, user)
		return redirect('/')


def register(request, lang=None):
	lang_cookie = request.COOKIES.get('language', None)
	# lang_accepted = ['fr', 'en', 'es']
	
	if request.method == 'POST':
		lang_cookie = request.COOKIES.get('language', None)
		Email = request.POST.get('email')
		username = request.POST.get('username')
		Pass1 = request.POST.get('password')
		Pass2 = request.POST.get('confirm_password')
		err_list = []
		if not username:
			if lang_cookie == 'fr':
				err_list.append("Le nom est obligatoire.")
			elif lang_cookie == 'en':
				err_list.append("The name is mandatory.")
			elif lang_cookie == 'es':
				err_list.append("El nombre es obligatorio.")
		if not Email:
			if lang_cookie == 'fr':
				err_list.append("L'e-mail est obligatoire.")
			elif lang_cookie == 'en':
				err_list.append("E-mail is mandatory.")
			elif lang_cookie == 'es':
				err_list.append("El correo electrónico es obligatorio.")
		if not Pass1:
			if lang_cookie == 'fr':
				err_list.append("Le mot de passe est obligatoire.")
			elif lang_cookie == 'en':
				err_list.append("The password is mandatory.")
			elif lang_cookie == 'es':
				err_list.append("La contraseña es obligatoria.")
		if Pass1 != Pass2:
			if lang_cookie == 'fr':
				err_list.append("Les mots de passe ne correspondent pas.")
			elif lang_cookie == 'en':
				err_list.append("The passwords do not match.")
			elif lang_cookie == 'es':
				err_list.append("Las contraseñas no coinciden.")
		if User.objects.filter(Email=Email).exists() or User.objects.filter(username=username).exists():
			if lang_cookie == 'fr':
				err_list.append("Cet e-mail ou ce nom est déjà utilisé.")
			elif lang_cookie == 'en':
				err_list.append("This e-mail or name is already in use.")
			elif lang_cookie == 'es':
				err_list.append("Esta dirección de correo electrónico o nombre ya está en uso.")
		
		if err_list:
			return JsonResponse({'success': False, 'err_list': err_list}, status=400)
		
		try:
			New_user = User.objects.Add_User(Email=Email, username=username, password=Pass2)
			New_user.is_active = False  # Désactivez l'utilisateur jusqu'à la vérification de l'email
			New_user.save()
			send_verification_email(New_user, lang_cookie)
			info_msg = "Votre compte a été créé. Veuillez vérifier votre email pour activer votre compte."
			if lang_cookie == 'en':
				info_msg = "Your account has been created. Please check your email to activate your account."
			elif lang_cookie == 'es':
				info_msg = "Su cuenta ha sido creada. Compruebe su correo electrónico para activar su cuenta."
			return JsonResponse({'success': True, 'info_msg': info_msg})
		except Exception as e:
			if lang_cookie == 'fr':
				err_list.append("Une erreur s'est produite lors de la création du compte.")
			elif lang_cookie == 'en':
				err_list.append("An error occurred during account creation.")
			elif lang_cookie == 'es':
				err_list.append("Se ha producido un error durante la creación de la cuenta.")
			return JsonResponse({'success': False, 'err_list': err_list}, status=400)

	return redirect('/')
	
	# if lang == None: #Cas avec aucune lang
	# 	if lang_cookie == None:
	# 		nav_lang = get_language()
	# 	else:
	# 		nav_lang = lang_cookie
	# 	if nav_lang == "en":
	# 		return redirect('/en/sign_in')
	# 	if nav_lang == "es":
	# 		return redirect('/es/sign_in')
	# 	else:
	# 		return redirect('/fr/sign_in')


	# if lang_cookie != lang and lang in lang_accepted:
	# 	return redirect('/api/lang/' + lang + "?prev=/sign_in")

	
	# if lang in lang_accepted:
	# 	translations = TextTranslation.objects.filter(Lang=lang)
	# 	texts_trans = {trans.Key : trans.Text for trans in translations}
	# 	return render(request, 'register.html', {'texts': texts_trans})

	# if lang_cookie == None:
	# 	nav_lang = get_language()
	# else:
	# 	nav_lang = lang_cookie

	# new_path = "/" + nav_lang + "/sign_in/"
	# return redirect(new_path)
