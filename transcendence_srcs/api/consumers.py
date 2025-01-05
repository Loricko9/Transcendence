from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
from asgiref.sync import sync_to_async  # type: ignore
from django.apps import apps # type: ignore
from django.contrib.auth import get_user_model # type: ignore
import json
import logging

logger = logging.getLogger(__name__)

class FriendshipConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.group_name = f"friendship_updates_{self.scope['user'].id}"
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(self.group_name, self.channel_name)

	async def receive(self, text_data):
		# Recevoir un message du client
		data = json.loads(text_data)

		# Recuperer commande si envoyee
		command = data.get('command')

		# recuperer la relation d'amitie
		Friendship = apps.get_model('api', 'Friendship')

		# Recuperer le modele de User
		User = get_user_model()

		if command == 'invite':
			friendship = await sync_to_async(Friendship.objects.get)(id=data.get('friendship_id'))
			sender_username = self.scope['user'].username
			if await sync_to_async(lambda: friendship.sender.username)() == sender_username:
				friend_username = await sync_to_async(lambda: friendship.receiver.username)()
			else:
				friend_username = await sync_to_async(lambda: friendship.sender.username)()
			friend = await sync_to_async(User.objects.get)(username=friend_username)
			await self.channel_layer.group_send(
				f'friendship_updates_{friend.id}',
				{
					'type': 'game_invite',
					'sender_username': sender_username,
				}
			)
		elif command == 'respond_to_invite':
			response = data.get('response')
			sender_username = data.get('sender_username')
			sender = await sync_to_async(User.objects.get)(username=sender_username)
			await self.channel_layer.group_send(
				f'friendship_updates_{sender.id}',
				{
					'type': 'invite_response',
					'from_user': self.scope['user'].username,
					'response': response,
					'sender_username': sender_username
				}
			)

	# Envoyer la mise à jour au client WebSocket
	async def send_friendship_update(self, event):
		await self.send(text_data=json.dumps(event['data']))

	async def game_invite(self, event):
		# Envoyer l'invitation au client cible
		await self.send(text_data=json.dumps({
			'type': 'invite',
			'sender_username': event['sender_username']
		}))

	async def invite_response(self, event):
		print("invite response")
		await self.send(text_data=json.dumps({
			'type': 'invite_response',
			'response': event['response'],
			'sender_username': event['from_user']
		}))

class MatchmakingConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.group_name = f"matchmaking_{self.scope['user'].id}"
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(self.group_name, self.channel_name)

	async def receive(self, text_data):
		# Recevoir un message du client
		data = json.loads(text_data)

		# recuperer les groups de matchmakings
		Matchmaking = apps.get_model('api', 'Matchmaking')

		# Recuperer le modele de User
		User = get_user_model()

		command = data.get('command')
		if command and command == 'delete':
			print("delete group")
			leader = await sync_to_async(User.objects.get)(username=self.scope['user'].username)
			await sync_to_async(lambda: Matchmaking.objects.filter(leader=leader).delete())()
			return
		elif command and command == 'notif':
			print("notif compris par django")
			user1 = await sync_to_async(User.objects.get)(username=data.get('username1'))
			user2 = await sync_to_async(User.objects.get)(username=data.get('username2'))
			leader_username = self.scope['user'].username
			if data.get('username1') != self.scope['user'].username:
				await self.channel_layer.group_send(
					f'matchmaking_{user1.id}',
					{
						'type': 'notif_update',
						'leader_username': leader_username,
					}
				)	
			await self.channel_layer.group_send(
				f'matchmaking_{user2.id}',
				{
					'type': 'notif_update',
					'leader_username': leader_username,
				}
			)
			return

	async def matchmaking_update(self, event):
		# Envoyer l'invitation au client cible
		await self.send(text_data=json.dumps(event['data']))

	async def notif_update(self, event):
		print("notif_update called")
		await self.send(text_data=json.dumps({
			'type': 'notif',
			'leader_username': event['leader_username']
		}))

