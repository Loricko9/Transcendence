from django.urls import path # type: ignore
from .consumers import FriendshipConsumer # type: ignore

websocket_urlpatterns = [
    path('ws/friendship/', FriendshipConsumer.as_asgi())
]
