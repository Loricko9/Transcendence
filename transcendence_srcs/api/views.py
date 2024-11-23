from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from api.models import User_tab
import os, requests

# Create your views here.
def get_data(request):
	data = {
		'message': 'test django test',
		'nb': [1,2,3,4]
	}
	return (JsonResponse(data))

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

	return JsonResponse({'success': False, 'message': 'Requête invalide.'}, status=400)