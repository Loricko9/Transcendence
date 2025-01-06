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

User = get_user_model()

def send_verification_email(user):
    # Créer le lien d'activation
    verification_link = f"{settings.SITE_URL}{reverse('verify_email')}?token={user.verification_token}&username={user.username}"

    # Charger le template HTML
    html_content = render_to_string('emails/verification_email.html', {
        'user': user,
        'verification_link': verification_link,
    })
    
    # Extraire le texte brut depuis le HTML (fallback pour les clients email simples)
    text_content = strip_tags(html_content)

    # Préparer l'email
    email = EmailMultiAlternatives(
        subject="Vérifiez votre adresse email",
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
	lang_accepted = ['fr', 'en', 'es']
	err_msg = {}
	
	if request.method == 'POST':
		Email = request.POST.get('Email')
		username = request.POST.get('username')
		Pass1 = request.POST.get('Password1')
		Pass2 = request.POST.get('Password2')
		if not username:
			err_msg['name'] = "Le nom est obligatoire."
		if not Email:
			err_msg['email'] = "L'e-mail est obligatoire."
		if not Pass1:
			err_msg['password'] = "Le mot de passe est obligatoire."
		if Pass1 != Pass2:
			err_msg['password_confirm'] = "Les Mots de passes ne sont pas identiques."
		if User.objects.filter(Email=Email).exists():
			err_msg['email'] = "Cet e-mail est déjà utilisé."
		if not err_msg:
			try:
				New_user = User.objects.Add_User(Email=Email, username=username, password=Pass2)
				New_user.is_active = False  # Désactivez l'utilisateur jusqu'à la vérification de l'email
				New_user.save()
				send_verification_email(New_user)
				messages.info(request, "Votre compte a été créé. Veuillez vérifier votre email pour activer votre compte.")
				return redirect('/')
			except Exception as e:
				err_msg['general'] = "Une erreur s'est produite lors de la création du compte."
	
	if lang == None: #Cas avec aucune lang
		if lang_cookie == None:
			nav_lang = get_language()
		else:
			nav_lang = lang_cookie
		if nav_lang == "en":
			return redirect('/en/sign_in')
		if nav_lang == "es":
			return redirect('/es/sign_in')
		else:
			return redirect('/fr/sign_in')


	if lang_cookie != lang and lang in lang_accepted:
		return redirect('/api/lang/' + lang + "?prev=/sign_in")

	
	if lang in lang_accepted:
		translations = TextTranslation.objects.filter(Lang=lang)
		texts_trans = {trans.Key : trans.Text for trans in translations}
		return render(request, 'register.html', {'err_msg': err_msg, 'texts': texts_trans})

	if lang_cookie == None:
		nav_lang = get_language()
	else:
		nav_lang = lang_cookie

	new_path = "/" + nav_lang + "/sign_in/"
	return redirect(new_path)
