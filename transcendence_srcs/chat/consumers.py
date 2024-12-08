from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import json
from .models import ChatMessage

class ChatConsumers(AsyncWebsocketConsumer):
	async def connect(self):
		# Récupérer le nom de la salle depuis l'URL
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		self.room_group_name = f'chat_{self.room_name}'

		# Rejoindre le groupe (channel layer)
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.accept()  # Accepter la connexion WebSocket

		# Charger les messages existants depuis la base de données
		messages = ChatMessage.objects.filter(room_name=self.room_name).order_by('timestamp')
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
		message = data['message']
		sender = self.scope['user'].username if self.scope['user'].is_authenticated else 'Anonymous'

		# Sauvegarder le message dans la base de données
		ChatMessage.objects.create(room_name=self.room_name, sender=sender, content=message)
	
		# Envoyer le message à tout le groupe
		await self.channel_layer.group_send(
		self.room_group_name,
			{
				'type': 'chat_message',
				'message': message
			}
		)

	async def chat_message(self, event):
		# Envoyer le message au WebSocket du client
		await self.send(text_data=json.dumps({
			'message': event['message']
		}))