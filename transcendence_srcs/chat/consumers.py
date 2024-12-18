from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import json
from django.apps import apps # type: ignore
from asgiref.sync import sync_to_async  # type: ignore # Pour exécuter des fonctions synchrones dans un contexte asynchrone
from datetime import datetime
from django.contrib.auth import get_user_model # type: ignore


class ChatConsumers(AsyncWebsocketConsumer):
	async def connect(self):
		# Récupérer le nom de la salle depuis l'URL
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		my_username = self.scope['user'].username
		self.room_group_name = f'chat_{self.room_name}'
		self.user_group_name = f'chat_{my_username}'
		# Rejoindre le groupe (channel layer)
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.channel_layer.group_add(self.user_group_name, self.channel_name)

		# Creer un groupe pour l'ami meme si pas connecte au chatSocket
		Friendship = apps.get_model('api', 'Friendship')
		room = await sync_to_async(Friendship.objects.get)(id=self.room_name)

		if await sync_to_async(lambda: room.sender.username)() == my_username:
			friend_username = await sync_to_async(lambda: room.receiver.username)()
		else:
			friend_username = await sync_to_async(lambda: room.sender.username)()
		self.friend_group_name = f'chat_{friend_username}'
		await self.channel_layer.group_add(self.friend_group_name, self.channel_name)

		# Accepter la connexion WebSocket
		await self.accept()
		print(self.room_group_name)
		print(self.user_group_name)
		print(self.friend_group_name)

		# Charger les messages existants depuis la base de données
		ChatMessage = apps.get_model('chat', 'ChatMessage') # Charger le modèle dynamiquement

		# Utiliser sync_to_async pour exécuter une requête synchrone
		messages = await sync_to_async(lambda: list(ChatMessage.objects.filter(room=self.room_name).order_by('timestamp')))()

		for message in messages:
			sender = await sync_to_async(lambda: message.sender)()  # Récupérer l'objet utilisateur
			await self.send(text_data=json.dumps({
				'message': message.content,
				'sender': sender.username,
				'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
			}))

	async def disconnect(self, close_code):
		# Quitter le groupe
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
		await self.channel_layer.group_discard(self.user_group_name, self.channel_name)
		if hasattr(self, 'friend_group_name'):
			await self.channel_layer.group_discard(self.friend_group_name, self.channel_name)

	async def receive(self, text_data):
		# Recuperer le modele de User
		User = get_user_model()

		# Recevoir un message du client
		data = json.loads(text_data)

		# Recuperer commande si envoyee
		command = data.get('command')

		# Charger le modèle dynamiquement
		ChatMessage = apps.get_model('chat', 'ChatMessage')

		# recuperer la room
		Friendship = apps.get_model('api', 'Friendship')
		room = await sync_to_async(Friendship.objects.get)(id=self.room_name)

		if command == 'delete_messages':
			# Supprimer les messages de la salle
			deleted_count, _ = await sync_to_async(ChatMessage.objects.filter(room=room).delete)()
			# Informer l'utilisateur de la suppression
			await self.send(text_data=json.dumps({
				'status': 'success',
				'deleted_count': deleted_count
			}))
			return
		elif command == 'block':
			username = data.get('username')
			user = await sync_to_async(User.objects.get)(username=username)
			if await room.is_blocked(user):
				await sync_to_async(room.blocked_users.remove)(user)
				await self.send(text_data=json.dumps({
					'status': 'success',
					'message': f'{user.username} a été débloqué.'
				}))
			else:
				# Ajouter l'utilisateur bloqué
				await sync_to_async(room.blocked_users.add)(user)
				await self.send(text_data=json.dumps({
					'status': 'success',
					'message': f'{user.username} a été bloqué.'
				}))
			return
		elif command == 'invite':
			print("commande invite comprise")
			sender_username = self.scope['user'].username
			if await sync_to_async(lambda: room.sender.username)() == sender_username:
				friend_username = await sync_to_async(lambda: room.receiver.username)()
			else:
				friend_username = await sync_to_async(lambda: room.sender.username)()
			print("friend_username " + friend_username)
			await self.channel_layer.group_send(
				f'chat_{friend_username}',
				{
					'type': 'game_invite',
					'sender_username': sender_username,
				}
			)
		elif command == 'respond_to_invite':
			response = data.get('response')
			sender_username = data.get('sender_username')
			print("sender_username " + sender_username)
			await self.channel_layer.group_send(
				f'chat_{sender_username}',
				{
					'type': 'invite_response',
					'from_user': self.scope['user'].username,
					'response': response,
					'sender_username': sender_username
				}
			)
		else:
			if await room.is_blocked(self.scope['user']):
				await self.send(text_data=json.dumps({
					'status': 'error',
					'message': 'Vous êtes bloqué par cet utilisateur.'
				}))
				return
			message = data['message']
			timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

			if self.scope['user'].is_authenticated:
				sender = self.scope['user']
			else:
				raise ValueError("User must be authenticated to send messages.")

			# Sauvegarder le message dans la base de données
			await sync_to_async(ChatMessage.objects.create)(
				room=room, sender=sender, content=message
			)

			# Envoyer le message à tout le groupe
			await self.channel_layer.group_send(
			self.room_group_name,
				{
					'type': 'chat_message',
					'message': message,
					'sender': sender.username,
					'timestamp': timestamp
				}
			)

	async def chat_message(self, event):
		# Envoyer le message au WebSocket du client
		await self.send(text_data=json.dumps({
			'message': event['message'],      # Contenu du message
			'sender': event.get('sender', 'Anonymous'),  # Expéditeur (par défaut : 'Anonymous')
			'timestamp': event.get('timestamp', 'Unknown Time')  # Heure d'envoi (par défaut : 'Unknown Time')
		}))

	async def game_invite(self, event):
		# Envoyer l'invitation au client cible
		print("game invite")
		if event['sender_username'] != self.scope['user'].username:
			print("game invite envoye a " + self.scope['user'].username)
			await self.send(text_data=json.dumps({
				'type': 'invite',
				'sender_username': event['sender_username']
			}))

	async def invite_response(self, event):
		# Envoyer la réponse au client expéditeur
		print("invite response")
		if event['sender_username'] == self.scope['user'].username:
			print("invite response envoye a " + self.scope['user'].username)
			await self.send(text_data=json.dumps({
				'type': 'invite_response',
				'response': event['response'],
				'message': f"{event['from_user']} a {event['response']} votre invitation.",
				'sender_username': event['from_user']
			}))
