from django.shortcuts import render, redirect # type: ignore
from django.contrib.auth import authenticate, login, update_session_auth_hash # type: ignore
from django.views.decorators.csrf import csrf_protect, csrf_exempt # type: ignore
from django.http import JsonResponse # type: ignore
import logging
from django.utils.translation import get_language # type: ignore
from .models import TextTranslation
from django.contrib.auth import logout # type: ignore
import json
from django.middleware.csrf import get_token # type: ignore
from django.contrib.auth.decorators import login_required # type: ignore

logger = logging.getLogger(__name__)

def login_view(request):
	if request.method == 'POST':
		email = request.POST.get('email')
		password = request.POST.get('password')

		user = authenticate(request, Email=email, password=password)
        
		if user is not None:
			login(request, user)
			user.connect()
			data = {'success': True, 'message': 'Connexion reussie'}
			response = JsonResponse(data)
			response['Content-Type'] = 'application/json; charset=utf-8'
			return response
		else:
			return JsonResponse({'success': False, 'message' : 'Connexion echouée', 'error': 'Identifiants invalides.'}, content_type='application/json; charset=utf-8')
	return JsonResponse({'success': False, 'error': 'Méthode non autorisée.'}, content_type='application/json; charset=utf-8')

@login_required
def logout_view(request):
	request.user.disconnect()
	logout(request)
	response =  JsonResponse({'success': True, 'message': 'Déconnexion réussie'})
	response['Content-Type'] = 'application/json; charset=utf-8'
	return response

def check_authentication(request):
	if request.user.is_authenticated:
		response = JsonResponse({'is_authenticated': True, 'is_user_42': request.user.is_user_42,
						   	'avatar': f'<img class="rounded-circle" src="{request.user.avatar}" alt="Avatar" width="75">',
					   		'user': request.user.username,
							'nb_win': request.user.nb_win,
            				'nb_lose': request.user.nb_lose
		})
		response['Content-Type'] = 'application/json; charset=utf-8'
		return response
	else:
		return JsonResponse({'is_authenticated': False})

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


def game_view(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		result = data.get('result', True)
		if result == True:
			request.user.nb_win += 1
		else:
			request.user.nb_lose += 1
		request.user.save()
		response = JsonResponse({'success': True,
					   		'message': 'Stats mises à jour',
							'nb_win': request.user.nb_win,
							'nb_lose': request.user.nb_lose
		})
		response['Content-Type'] = 'application/json; charset=utf-8'
		return response
	else:
		return JsonResponse({'success': False}, status=400)
	

# Génère un nouveau token CSRF et le renvoie
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

# Supprime l'utilisateur authentifié
@login_required
def delete_account(request):
	if request.method == 'POST':
		user = request.user
		user.disconnect()
		logout(request)
		user.delete()
		return JsonResponse({'success': True, 'message': 'Votre compte a été supprimé avec succès.'})
	return JsonResponse({'success': False, 'message': 'Requête invalide.'}, status=400)
