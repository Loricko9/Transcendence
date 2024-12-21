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
		logger.info(f"send_friendship_update called with data: {event['data']}")
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
			'message': f"{event['from_user']} a {event['response']} votre invitation.",
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

		if Matchmaking.objects.exists():
			groups = Matchmaking.objects.all()
			for group in groups:
				if group.is_full() == False:
					leader = User.objects.get(username=group.leader.username)
					member = User.objects.get(username=self.scope['user'].username)
					group.add_member(member)
					await self.channel_layer.group_send(
						f'matchmaking_{leader.id}',
						{
							'type': 'matchmaking_update',
							'waiting': False,
							'member_username': member.username,
							'playerNb': group.max_members,
							'leader': True
						}
					)
					await self.channel_layer.group_send(
					self.group_name,
						{
							'type': 'matchmaking_update',
							'leader': False,
							'waiting': False,
							'leader_username': leader.username
						}
					)
		else:
			leader = User.objects.get(username=self.scope['user'].username)
			print("leader matchmaking: " + leader)
			group = Matchmaking.objects.create(leader=leader, max_members=data.get('playerNb'))
			await self.channel_layer.group_send(
				self.group_name,
				{
					'type': 'matchmaking_update',
					'waiting': True,
				}
			)

	async def matchmaking_update(self, event):
		# Envoyer l'invitation au client cible
		await self.send(text_data=json.dumps({
			'waiting': event['waiting'],
			'member_username': event['member_username'],
			'playerNb': event['playerNb'],
			'leader': event['leader'],
			'leader_username': event['leader_username']
		}))
