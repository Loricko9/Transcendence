from django.urls import path # type: ignore
from consumers import ChatConsumer # type: ignore

websocket_urlpatterns = [
    path('ws/chat/<str:room_name>/', ChatConsumer.as_asgi()),
]
