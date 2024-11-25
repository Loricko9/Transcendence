from django.shortcuts import render, redirect # type: ignore
from django.http import JsonResponse, HttpResponse # type: ignore
from .models import User_tab, Friendship
from django.shortcuts import get_object_or_404 # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework import status # type: ignore
from .serializers import FriendshipSerializer
from django.contrib.auth import get_user_model # type: ignore

User = get_user_model()

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


class FriendshipListView(APIView):
	permission_classes = [IsAuthenticated]
     
	def get(self, request):
		# Récupérer tous les amis de l'utilisateur connecté
		friendships = Friendship.objects.filter(sender=request.user) | Friendship.objects.filter(receiver=request.user)
		serializer = FriendshipSerializer(friendships, many=True)
		response_data = {
			"username": request.user.username,
			"friendships": serializer.data
		}
		return Response(response_data)


@api_view(['POST'])
def send_friend_request(request):
    # Vérifier si un 'username' est passé dans la requête
    receiver_username = request.data.get('receiver_username')
    if not receiver_username:
        return Response({"error": "Receiver username is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Récupérer l'utilisateur destinataire de la demande
        receiver = User.objects.get(username=receiver_username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Ne pas permettre à un utilisateur de s'ajouter lui-même
    if receiver == request.user:
        return Response({"error": "You cannot add yourself as a friend"}, status=status.HTTP_400_BAD_REQUEST)

    # Vérifier si une amitié existe déjà
    if Friendship.objects.filter(sender=request.user, receiver=receiver).exists() or Friendship.objects.filter(sender=receiver, receiver=request.user).exists():
        return Response({"error": "You are already friends"}, status=status.HTTP_400_BAD_REQUEST)

    # Créer une relation d'amitié
    Friendship.objects.create(sender=request.user, receiver=receiver)
    return Response({"message": f"Friend request sent to {receiver.username}"}, status=status.HTTP_201_CREATED)

# afficher la liste des demandes d'amis
class FriendRequestListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Récupérer toutes les demandes d'ami en attente (status = 'pending')
        pending_requests = Friendship.objects.filter(receiver=request.user, status='pending')
        serializer = FriendshipSerializer(pending_requests, many=True)
        return Response(serializer.data)

# repondre a la demande d'amis
@api_view(['PATCH'])
def respond_to_friend_request(request, username):
    try:
        # Trouver l'utilisateur qui a envoyé la demande
        sender = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Vérifier s'il y a une demande d'ami en attente
    friendship = Friendship.objects.filter(sender=sender, receiver=request.user, status='pending').first()
    if not friendship:
        return Response({"error": "No pending friend request from this user"}, status=status.HTTP_404_NOT_FOUND)

    # Vérifier l'action (accepter ou refuser)
    action = request.data.get('action')
    if action == 'accepted':
        friendship.status = 'accepted'
    elif action == 'rejected':
        friendship.status = 'rejected'
    else:
        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

    friendship.save()
    return Response({"message": f"Friend request {action}"}, status=status.HTTP_200_OK)

def friend_delete(request, username):
	friend = User.objects.get(username=username)
	if Friendship.objects.filter(sender=request.user, receiver=friend).exists():
		Friendship.objects.delete(sender=request.user, receiver=friend)
	elif Friendship.objects.filter(sender=friend, receiver=request.user).exists():
		Friendship.objects.delete(sender=friend, receiver=request.user)
	return Response({"message": "Friend successful delete"}, status=status.HTTP_200_OK)