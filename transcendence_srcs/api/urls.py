from django.urls import path # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
from . import views
from rest_framework.routers import DefaultRouter # type: ignore

urlpatterns = [
	path('friends/', views.FriendshipListView.as_view(), name='friendship-list'),  # Liste des amis
    path('friend-request/', views.send_friend_request, name='send-friend-request'),  # Envoyer une demande d'ami
	path('friend-requests/', views.FriendRequestListView.as_view(), name='friend-request-list'),  # Liste des demandes
    path('friend-request/<str:username>/', views.respond_to_friend_request, name='respond-to-friend-request'),  # Répondre à une demande
	path('lang/<str:lang>', views.set_lang, name='set_lang'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
