from django.shortcuts import render, redirect
from api.models import User_tab, User_tabManager
from django.contrib import messages
from frontend.models import TextTranslation
from django.utils.translation import get_language

# Create your views here.

def register(request, lang=None):
	lang_cookie = request.COOKIES.get('language', None)
	lang_accepted = ['fr', 'en', 'es']
	err_msg = None
	
	if request.method == 'POST':
		Email = request.POST.get('Email')
		Pass1 = request.POST.get('Password1')
		Pass2 = request.POST.get('Password2')
		
		if Pass1 != Pass2:
			err_msg = "Les Mots de passes ne sont pas identiques"
		else:
			try:
				New_user = User_tab.objects.Add_User(Email=Email, Password=Pass2)
				messages.success(request, "Compte créé avec succès")
				return redirect('/')
			except ValueError as e:
				err_msg = str(e)
	
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
	