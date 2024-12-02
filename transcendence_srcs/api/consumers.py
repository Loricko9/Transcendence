from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
import json
import logging

logger = logging.getLogger(__name__)

class FriendshipConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = f"friendship_updates_{self.scope['user'].id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({"message": "Test message from server"}))
        await self.send_friendship_update({
            "type": "friendship_update",
            "data": {"message": "This is a test friendship update"}
        })

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

	# Envoyer la mise à jour au client WebSocket
    async def send_friendship_update(self, event):
        logger.info(f"send_friendship_update called with data: {event['data']}")
        await self.send(text_data=json.dumps(event['data']))

# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f'chat_{self.room_name}'

#         # Ajouter l'utilisateur au groupe
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )
#         await self.accept()

#     async def disconnect(self, close_code):
#         # Retirer l'utilisateur du groupe
#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message = data['message']

#         # Envoyer le message au groupe
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message
#             }
#         )

#     async def chat_message(self, event):
#         message = event['message']

#         # Envoyer le message à WebSocket
#         await self.send(text_data=json.dumps({
#             'message': message
#         }))

