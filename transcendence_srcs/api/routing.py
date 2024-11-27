from django.urls import path # type: ignore
from transcendence_srcs.api.consumers import FriendshipConsumer # type: ignore

websocket_urlpatterns = [
    path(r'ws/friendship/$', FriendshipConsumer.as_asgi()),
]
