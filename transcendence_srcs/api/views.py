from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.middleware.csrf import get_token
from django.contrib.auth import logout
from django.conf import settings
from api.models import User_tab
import os, requests, json, logging

# Create your views here.
def set_lang(request, lang):
	accept_lang = ['fr', 'en', 'es']
	if lang not in accept_lang:
		return redirect('/404')

	reponse = redirect(request.GET.get('prev', '/'))

	tps = 31536000
	reponse.set_cookie('language', lang, max_age=tps)
	return reponse

def log_42(request):
	code = request.GET.get('code')
	if not code:
		return HttpResponse("Error log to 42", status=400)
	try:
		token_response = requests.post(
			'https://api.intra.42.fr/oauth/token', 
			data={
				'grant_type': 'authorization_code',
                'client_id': os.getenv('CLIENT_ID'),
                'client_secret': os.getenv('CLIENT_SECRET'),
                'code': code,
                'redirect_uri': os.getenv('REDIRECT_URI'),
            }
		)
		if token_response.status_code != 200:
			return HttpResponse("Error token response !", status=500)

		access_token = token_response.json().get('access_token')

		user_response = requests.get(
			'https://api.intra.42.fr/v2/me', 
			headers={'Authorization': f'Bearer {access_token}'})
		if user_response.status_code != 200:
			return HttpResponse("Error user Response ! code : " + str(user_response.status_code), status=500)
		
		user_data = user_response.json()
		user_email = user_data['email']
		user_login = user_data['login']
		avatar_url = user_data.get('image', {}).get('link', None)
		try:
			user = User_tab.objects.get(Email=user_email)
		except User_tab.DoesNotExist:
			passwd = User_tab.objects.make_random_password()
			user = User_tab.objects.Add_User(Email=user_email, username=user_login, password=passwd)
			user.avatar = avatar_url
			user.is_email_verified = True
			user.is_user_42 = True
			user.save()
		
		login(request, user)
		user.connect()
		return redirect('/')

	except Exception as e:
		return HttpResponse("Error log machine: " + str(e), status=500)

# Change password
@login_required
@csrf_protect
def change_password(request):
	if request.method == 'POST':
		old_password = request.POST.get('old_password')
		new_password = request.POST.get('new_password')
		confirm_password = request.POST.get('confirm_password')

		if new_password != confirm_password:
			return JsonResponse({'success': False, 'message': 'Les mots de passe ne correspondent pas.'}, status=400)

		user = request.user

		# Vérifie si l'ancien mot de passe est correct
		if not user.check_password(old_password):
			return JsonResponse({'success': False, 'message': 'Ancien mot de passe incorrect.'}, status=400)

		# Change le mot de passe et sauvegarde l'utilisateur
		user.set_password(new_password)
		user.save()

		update_session_auth_hash(request, user)
		# Authentifie à nouveau l'utilisateur avec son nouveau mot de passe
		login(request, user)

		return JsonResponse({'success': True, 'message': 'Mot de passe changé avec succès.'})

	return redirect('/')

# Change avatar
@login_required
def change_avatar(request):
	if request.method == "POST":
		selected_avatar = request.POST.get("avatar")
		if selected_avatar and os.path.exists("/transcendence" + selected_avatar):
			request.user.avatar = selected_avatar
			request.user.save()
			return JsonResponse({'success': True, 'message': 'Avatar changé avec succès.'})
		return JsonResponse({'success': False, 'message': 'Aucun avatar sélectionné ou Avatar invalide'})
	
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
	return redirect('/')

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
	return redirect('/')

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
						   	'avatar': f'<img class="rounded-circle" src="{request.user.avatar}" alt="Avatar" width="65">',
					   		'user': request.user.username,
							'nb_win': request.user.nb_win,
            				'nb_lose': request.user.nb_lose
		})
		response['Content-Type'] = 'application/json; charset=utf-8'
		return response
	else:
		return JsonResponse({'is_authenticated': False})
	
def get_stats(request):
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
	return redirect('/')

def find_username(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		username = data.get('username')
		if username:
			if User_tab.objects.filter(username=username).exists():
				user = User_tab.objects.get(username=username)
				return JsonResponse({'user': user.username, 'userIcon': user.avatar.url})
		return JsonResponse({'username' : None})
	return redirect('/')
	
@login_required
@csrf_exempt
def find_hostname(request):
	if request.method == 'POST':
		try:
			user = request.user
			if user.is_authenticated:
				return JsonResponse({'user': user.username, 'userIcon': user.avatar.url})
			else:
				return JsonResponse({'error': 'User not authenticated'})
		except json.JSONDecodeError:
			return JsonResponse({'error': 'Invalid JSON data'})
	return redirect('/')

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
	return redirect('/')
