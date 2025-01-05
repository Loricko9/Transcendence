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
		self.room_group_name = f'chat_{self.room_name}'
		# Rejoindre le groupe (channel layer)
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		# Accepter la connexion WebSocket
		await self.accept()

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

		# Recuperer la langue pour les notifs
		lang = data.get('lang')

		if command == 'delete_messages':
			# Supprimer les messages de la salle
			await sync_to_async(ChatMessage.objects.filter(room=room).delete)()
			return
		elif command == 'block':
			username = data.get('username')
			user = await sync_to_async(User.objects.get)(username=username)
			if await room.is_blocked(user):
				unblock_msg = username + " debloqué(e)."
				if lang == 'en':
					unblock_msg = username + " unblocked."
				elif lang == 'es':
					unblock_msg = username + " desbloqueado."
				await sync_to_async(room.blocked_users.remove)(user)
				await self.send(text_data=json.dumps({
					'type': 'notif_message',
					'message': unblock_msg
				}))
			else:
				# Ajouter l'utilisateur bloqué
				block_msg = username + " bloqué(e)."
				if lang == 'en':
					block_msg = username + " blocked."
				elif lang == 'es':
					block_msg = username + " bloqueado."
				await sync_to_async(room.blocked_users.add)(user)
				print(block_msg)
				await self.send(text_data=json.dumps({
					'type': 'notif_message',
					'message': block_msg
				}))
			return
		else:
			if await room.is_blocked(self.scope['user']):
				blocked_msg = "Vous êtes bloqué(e) par ce joueur."
				if lang == 'en':
					blocked_msg = "You are blocked by this player."
				elif lang == 'es':
					blocked_msg = "Este jugador te ha bloqueado."
				await self.send(text_data=json.dumps({
					'type': 'notif_message',
					'message': blocked_msg
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

			# notif if needs
			Notifications = apps.get_model('api', 'Notifications')
			if await sync_to_async(lambda: room.sender.username)() == sender.username:
				friend_username = await sync_to_async(lambda: room.receiver.username)()
			else:
				friend_username = await sync_to_async(lambda: room.sender.username)()
			friend = await sync_to_async(User.objects.get)(username=friend_username)
			if await sync_to_async(lambda: not friend.is_connected)():
				notif_message = friend_username + " vous a envoyé un message !"
				if lang == 'en':
					notif_message = friend_username + " send you a message !"
				elif lang == 'es':
					notif_message = friend_username + " te ha enviado un mensaje !"
				await sync_to_async(Notifications.objects.create)(user=friend, message=notif_message)
				print("notif de message saved")

			# Envoyer le message à tout le groupe
			await self.channel_layer.group_send(
			self.room_group_name,
				{
					'type': 'chat_message',
					'message': message,
					'sender': sender.username,
					'timestamp': timestamp,
				}
			)

	async def chat_message(self, event):
		# Envoyer le message au WebSocket du client
		await self.send(text_data=json.dumps({
			'message': event['message'],      # Contenu du message
			'sender': event.get('sender', 'Anonymous'),  # Expéditeur (par défaut : 'Anonymous')
			'timestamp': event.get('timestamp', 'Unknown Time'),  # Heure d'envoi (par défaut : 'Unknown Time')
		}))

	async def notif_message(self, event):
		# Envoyer le message au WebSocket du client
		await self.send(text_data=json.dumps({
			'type': 'notif',
			'message': event['message'],
		}))