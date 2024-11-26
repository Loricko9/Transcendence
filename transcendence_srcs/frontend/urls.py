from django.urls import path # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('login/', views.login_view, name='login'),
	path('logout/', views.logout_view, name='custom-logout'),
	path('delete-account/', views.delete_account, name='delete_account'),
	path('change-password/', views.change_password, name='change_password'),
	path('change-avatar/', views.change_avatar, name='change_avatar'),
	path('get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
	path('game/', views.game, name='game'),
	path('stat/', views.get_stats, name='stat'),
	path('find-username', views.find_username, name='find_username'),
	path('check-auth/', views.check_authentication, name='check_authentication'),
	path('<str:lang>/', views.index_lang),
	path('<str:lang>/<path:any>/', views.index_lang)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)