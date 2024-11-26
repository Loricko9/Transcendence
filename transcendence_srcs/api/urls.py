from django.urls import path # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
from . import views

urlpatterns = [
	path('log-42/', views.log_42, name='log_42'),
	path('change-password/', views.change_password, name='change_password'),
	path('change-avatar/', views.change_avatar, name='change_avatar'),
	path('login/', views.login_view, name='login'),
	path('logout/', views.logout_view, name='custom-logout'),
	path('delete-account/', views.delete_account, name='delete_account'),
	path('get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
	path('stat/', views.get_stats, name='stat'),
	path('find-username/', views.find_username, name='find_username'),
	path('find-hostname/', views.find_hostname, name='find_hostname'),	
	path('check-auth/', views.check_authentication, name='check_authentication'),
	path('lang/<str:lang>', views.set_lang, name='set_lang'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)