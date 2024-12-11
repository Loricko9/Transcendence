"""
ASGI config for transcendance_srcs project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

# import os

# from django.core.asgi import get_asgi_application # type: ignore

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendance_srcs.settings')

# application = get_asgi_application()

import os
from django.core.asgi import get_asgi_application # type: ignore
from channels.routing import ProtocolTypeRouter, URLRouter # type: ignore
from channels.auth import AuthMiddlewareStack # type: ignore
from api.routing import websocket_urlpatterns as api_websocket_urlpatterns
from chat.routing import websocket_urlpatterns as chat_websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence_srcs.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            api_websocket_urlpatterns + chat_websocket_urlpatterns
        )
    ),
})
