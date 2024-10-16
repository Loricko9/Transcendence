from django.shortcuts import render, redirect # type: ignore
# from api.models import User_tab, User_tabManager
from django.contrib.auth import get_user_model # type: ignore
from django.contrib import messages # type: ignore
from frontend.models import TextTranslation
from django.utils.translation import get_language # type: ignore

User = get_user_model()

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
				messages.success(request, "Compte créé avec succès")
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
	
