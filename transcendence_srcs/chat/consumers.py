from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import json
from django.apps import apps # type: ignore
from asgiref.sync import sync_to_async  # type: ignore # Pour exécuter des fonctions synchrones dans un contexte asynchrone
from datetime import datetime

class ChatConsumers(AsyncWebsocketConsumer):
	async def connect(self):
		# Récupérer le nom de la salle depuis l'URL
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		self.room_group_name = f'chat_{self.room_name}'

		# Rejoindre le groupe (channel layer)
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.accept()  # Accepter la connexion WebSocket

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
		else:	
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