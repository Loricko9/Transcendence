from django.shortcuts import render, redirect # type: ignore
from django.http import JsonResponse, HttpResponse # type: ignore
from .models import User_tab, Friendship, History
from django.shortcuts import get_object_or_404, render, redirect # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework import status # type: ignore
from django.contrib.auth import get_user_model, authenticate, login, logout, update_session_auth_hash # type: ignore
from django.views.decorators.csrf import csrf_protect, csrf_exempt # type: ignore
from django.contrib.auth.decorators import login_required # type: ignore
from django.middleware.csrf import get_token # type: ignore
from django.conf import settings # type: ignore
import os, requests, json, logging
from asgiref.sync import async_to_sync # type: ignore
from channels.layers import get_channel_layer # type: ignore
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

# Create your views here.
def set_lang(request, lang):
	accept_lang = ['fr', 'en', 'es']
	if lang not in accept_lang:
		return redirect('/404')

	reponse = redirect(request.GET.get('prev', '/'))

	tps = 31536000
	reponse.set_cookie('language', lang, max_age=tps)
	return reponse

# Afficher la liste des amis
# @login_required
class FriendshipListView(APIView):
	permission_classes = [IsAuthenticated]
     
	def get(self, request):
		# Récupérer tous les amis de l'utilisateur connecté
		username = request.user
		friendships = Friendship.objects.filter(sender=username) | Friendship.objects.filter(receiver=username)
		lst = []
		for friendship in friendships:
			if (friendship.sender == username):
				friend = friendship.receiver
			else :
				friend = friendship.sender
			res = {
				"id": friendship.id,
				"username": friend.username,
				"avatar": f"{friend.avatar}",
				"status": friendship.status,
				"is_connected": friend.is_connected
			}
			if (friendship.status == "pending" and friendship.sender == username):
				res['wait_pending'] = True
			lst.append(res)
		return JsonResponse({"friendships": lst})

	def delete(self, request, id):
		try:
			friendship = Friendship.objects.get(id=id)
			if friendship.sender == request.user or friendship.receiver == request.user:
				other_user = friendship.receiver if friendship.sender == request.user else friendship.sender
				friendship.delete()
				# Notifier l'autre utilisateur
				channel_layer = get_channel_layer()
				async_to_sync(channel_layer.group_send)(
					f"friendship_updates_{other_user.id}",
					{
						"type": "send_friendship_update",
						"data": {"message": f"{request.user.username} has removed you as a friend."}
					}
				)
				return Response({"message": "Friendship deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
			else:
				return Response({"error": "Not authorized to delete this friendship."}, status=status.HTTP_403_FORBIDDEN)
		except Friendship.DoesNotExist:
			return Response({"error": "Friendship not found."}, status=status.HTTP_404_NOT_FOUND)

class FriendProfileView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, id):
		try:
			friendship = Friendship.objects.get(id=id)
			if friendship.sender == request.user or friendship.receiver == request.user:
				friend = friendship.receiver if friendship.sender == request.user else friendship.sender
				history_data = History.objects.filter(user=friend).values('date', 'enemy', 'score', 'result')
				profile_data = {
					"username": friend.username,
					"avatar": friend.avatar.url,
					"nb_win": friend.nb_win,
					"nb_lose": friend.nb_lose,
					"nb_tournament_win": friend.nb_tournament_win,
					"nb_tournament_lose": friend.nb_tournament_lose,
					'history': list(history_data),
				}
				return JsonResponse(profile_data)
			else:
				return Response({"error": "Not authorized to see this profile."}, status=status.HTTP_403_FORBIDDEN)
		except Friendship.DoesNotExist:
			return Response({"error": "Friendship not found."}, status=status.HTTP_404_NOT_FOUND)

# @login_required
@api_view(['POST'])
def send_friend_request(request):
	receiver_username = request.data.get('receiver_username')
	if not receiver_username:
		return Response({"error": "Receiver username is required"}, status=status.HTTP_400_BAD_REQUEST)
	try:
		receiver = User.objects.get(username=receiver_username)
	except User.DoesNotExist:
		return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
	if receiver == request.user:
		return Response({"error": "You cannot add yourself as a friend"}, status=status.HTTP_400_BAD_REQUEST)
	if Friendship.objects.filter(sender=request.user, receiver=receiver).exists() or Friendship.objects.filter(sender=receiver, receiver=request.user).exists():
		return Response({"error": "You are already friends"}, status=status.HTTP_400_BAD_REQUEST)
	Friendship.objects.create(sender=request.user, receiver=receiver)
	channel_layer = get_channel_layer()
	group_name = f"friendship_updates_{receiver.id}"
	logger.info(f"Sending message to group: {group_name} with data: {request.user.username}")
	async_to_sync(channel_layer.group_send)(
	group_name,
		{
			"type": "send_friendship_update",
			"data": {"message": f"You have a new friend request from {request.user.username}"}
		}
	)
	return Response({"message": f"Friend request sent to {receiver.username}"}, status=status.HTTP_201_CREATED)

# repondre a la demande d'amis
@api_view(['PATCH'])
def respond_to_friend_request(request, id):
	try:
		sender = User.objects.get(username=request.data.get('username'))
	except User.DoesNotExist:
		return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

	# Vérifier s'il y a une demande d'ami en attente
	friendship = Friendship.objects.filter(id=id, sender=sender, status='pending').first()
	if not friendship:
		return Response({"error": "No pending friend request from this user"}, status=status.HTTP_404_NOT_FOUND)

	# Vérifier l'action (accepter ou refuser)
	action = request.data.get('action')
	if action == 'accepted':
		friendship.status = 'accepted'
		message = f"{request.user.username} has accepted your friend request."
		friendship.save()
	elif action == 'rejected':
		friendship.delete()
		message = f"{request.user.username} has rejected your friend request."
	else:
		return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

	# Notifier l'utilisateur qui a envoyé la demande
	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(
		f"friendship_updates_{sender.id}",
		{
			"type": "send_friendship_update",
			"data": {"message": message}
		}
	)
	return Response({"message": f"Friend request {action}"}, status=status.HTTP_200_OK)

# def friend_delete(request, username):
# 	friend = User.objects.get(username=username)
# 	if Friendship.objects.filter(sender=request.user, receiver=friend).exists():
# 		Friendship.objects.delete(sender=request.user, receiver=friend)
# 	elif Friendship.objects.filter(sender=friend, receiver=request.user).exists():
# 		Friendship.objects.delete(sender=friend, receiver=request.user)
# 	return Response({"message": "Friend successful delete"}, status=status.HTTP_200_OK)

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

@login_required
def logout_view(request):
	request.user.disconnect()
	logout(request)
	response =  JsonResponse({'success': True, 'message': 'Déconnexion réussie'})
	response['Content-Type'] = 'application/json; charset=utf-8'
	return response

def check_authentication(request):
	if request.user.is_authenticated:
		path_avatar = str(request.user.avatar)
		if path_avatar.startswith("avatars"):
			avatar = request.user.avatar.url
		else:
			avatar = request.user.avatar
		response = JsonResponse({'is_authenticated': True,
								'is_user_42': request.user.is_user_42,
								'avatar': str(avatar),
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
		try:
			user = request.user
			if user.is_authenticated:
				history_data = History.objects.filter(user=user).values('date', 'enemy', 'score', 'result')
				return JsonResponse({'win': user.nb_win, 'lose': user.nb_lose, 'history': list(history_data)})
			else:
				return JsonResponse({'error': 'User not authenticated'})
		except json.JSONDecodeError:
			return JsonResponse({'error': 'Invalid JSON data'})
	return (redirect('/'))

def update_score(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		user_win = data.get('winner')
		user_win_score = data.get('winnerScore')

		user_lose = data.get('loser')
		user_lose_score = data.get('loserScore')

		isTournament = data.get('isTournament')

		if user_win and user_win != 'AI':
			if User_tab.objects.filter(username=user_win).exists():
				Wuser = User_tab.objects.get(username=user_win)
				Wuser.nb_win += 1
				if isTournament:
					Wuser.nb_tournament_win += 1
				Wuser.save()

		if user_lose and user_lose != 'AI':
			if User_tab.objects.filter(username=user_lose).exists():
				Luser = User_tab.objects.get(username=user_lose)
				Luser.nb_lose += 1
				if isTournament:
					Luser.nb_tournament_lose += 1
				Luser.save() # i forgot to save the user lol
			
		# if user_win and user_lose:
		# 	if User_tab.objects.filter(username=user_win).exists() and User_tab.objects.filter(username=user_lose).exists():
		# 		Wuser = User_tab.objects.get(username=user_win)
		# 		Luser = User_tab.objects.get(username=user_lose)
		# 		Wuser.nb_win += 1
		# 		Luser.nb_lose += 1
		# 		if isTournament:
		# 			Wuser.nb_tournament_win += 1
		# 			Luser.nb_tournament_lose += 1
				try:
					if (user_win != 'AI'):
						History.Add_History(Wuser, Luser, user_win_score, user_lose_score)
					if (user_lose != 'AI'):
						History.Add_History(Luser, Wuser, user_lose_score, user_win_score)
				except ValueError as e:
					return JsonResponse({'error': str(e)})
		return JsonResponse({'username' : None})
	return redirect('/')

def find_username(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		username = data.get('username')
		if username:
			if User_tab.objects.filter(username=username).exists():
				user = User_tab.objects.get(username=username)
				return JsonResponse({'user': user.username, 'userIcon': f'{user.avatar}'})
		return JsonResponse({'username' : None})
	return redirect('/')
	
@login_required
@csrf_exempt
def find_hostname(request):
	if request.method == 'POST':
		try:
			user = request.user
			print("Host name", flush=True)
			print(user.avatar, flush=True)
			if user.is_authenticated:
				return JsonResponse({'user': user.username, 'userIcon': f'{user.avatar}'})
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
