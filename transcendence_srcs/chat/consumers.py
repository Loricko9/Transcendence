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
		# Charger le modèle dynamiquement
		ChatMessage = apps.get_model('chat', 'ChatMessage')

		# Utiliser sync_to_async pour exécuter une requête synchrone
		messages = await sync_to_async(lambda: list(ChatMessage.objects.filter(room_name=self.room_name).order_by('timestamp')))()

		for message in messages:
			await self.send(text_data=json.dumps({
				'message': message.content,
				'sender': message.sender,
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

		if command == 'delete_messages':
			# Supprimer les messages de la salle
			deleted_count, _ = await sync_to_async(ChatMessage.objects.filter(room_name=self.room_name).delete)()
			# Informer l'utilisateur de la suppression
			await self.send(text_data=json.dumps({
				'status': 'success',
				'deleted_count': deleted_count
			}))
		else:	
			message = data['message']
			sender = self.scope['user'].username if self.scope['user'].is_authenticated else 'Anonymous'
			timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

			# Sauvegarder le message dans la base de données
			await sync_to_async(ChatMessage.objects.create)(
				room_name=self.room_name, sender=sender, content=message
			)

			# Envoyer le message à tout le groupe
			await self.channel_layer.group_send(
			self.room_group_name,
				{
					'type': 'chat_message',
					'message': message,
					'sender': sender,
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