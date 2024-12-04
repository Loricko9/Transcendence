from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import json
import logging
from .models import ChatMessage

logger = logging.getLogger(__name__)

class FriendshipConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.group_name = f"friendship_updates_{self.scope['user'].id}"
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()
		# await self.send(text_data=json.dumps({"message": "Test message from server"}))
		# await self.send_friendship_update({
		#     "type": "friendship_update",
		#     "data": {"message": "This is a test friendship update"}
		# })

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(self.group_name, self.channel_name)

	# Envoyer la mise à jour au client WebSocket
	async def send_friendship_update(self, event):
		logger.info(f"send_friendship_update called with data: {event['data']}")
		await self.send(text_data=json.dumps(event['data']))

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
