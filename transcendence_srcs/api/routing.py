from django.urls import path # type: ignore
from .consumers import FriendshipConsumer # type: ignore
from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore

class TestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

websocket_urlpatterns = [
    path('test/', TestConsumer.as_asgi()),
    path('friendship/', FriendshipConsumer.as_asgi()),
]
