from django.urls import path, re_path # type: ignore
from . import consumers # type: ignore

websocket_urlpatterns = [
    re_path(r'ws/friendship/$', consumers.FriendshipConsumer.as_asgi()),
	re_path(r'ws/matchmaking/$', consumers.MatchmakingConsumer.as_asgi()),
]
