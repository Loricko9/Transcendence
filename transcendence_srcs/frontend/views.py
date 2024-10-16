from django.shortcuts import render, redirect # type: ignore
from django.contrib.auth import authenticate, login # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from django.http import JsonResponse # type: ignore
import logging
from django.utils.translation import get_language # type: ignore
from .models import TextTranslation

logger = logging.getLogger(__name__)

# @csrf_exempt  # Ajoutez ceci pour autoriser les requêtes sans le token CSRF, mais ce n'est pas recommandé pour les requêtes POST sensibles.
def login_view(request):
	if request.method == 'POST':
		email = request.POST.get('email')
		password = request.POST.get('password')

		user = authenticate(request, Email=email, password=password)
        
		if user is not None:
			login(request, user)
			user.connect()
			return JsonResponse({'success': True, 'message': '<p>Connexion reussie</p>'})
		else:
			  # Log pour les échecs
			return JsonResponse({'success': False, 'message' : 'Connexion echouée', 'error': 'Identifiants invalides.'})
	logger.info("Méthode non autorisée")  # Log pour les méthodes autres que POST
	return JsonResponse({'success': False, 'error': 'Méthode non autorisée.'})


# Create your views here.
def index(request):
	lang_cookie = request.COOKIES.get('language', None)
	
	if lang_cookie == None:
		nav_lang = get_language()
	else:
		nav_lang = lang_cookie
	
	if nav_lang == "en":
		return redirect('/en/')
	if nav_lang == "es":
		return redirect('/es/')
	else:
		return redirect('/fr/')

def index_lang(request, lang, any=None):
	lang_cookie = request.COOKIES.get('language', None)
	lang_accepted = ['fr', 'en', 'es']

	if lang_cookie != lang and lang in lang_accepted:
		return redirect('/api/lang/' + lang + "?prev=" + request.path)

	if lang in lang_accepted:
		translations = TextTranslation.objects.filter(Lang=lang)
		texts_trans = {trans.Key : trans.Text for trans in translations}
		return render(request, 'index.html', {"texts": texts_trans})
	
	if lang_cookie == None:
		nav_lang = get_language()
	else:
		nav_lang = lang_cookie

	new_path = "/" + nav_lang + request.path
	
	return redirect(new_path)
