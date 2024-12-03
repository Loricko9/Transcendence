from django.urls import re_path # type: ignore
from .consumers import FriendshipConsumer # type: ignore

websocket_urlpatterns = [
    re_path(r'ws/friendship/$', FriendshipConsumer.as_asgi()),
]
