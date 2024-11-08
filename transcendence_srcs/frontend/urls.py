from django.urls import path # type: ignore
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('login/', views.login_view, name='login'),
	path('logout/', views.logout_view, name='custom-logout'),
	path('delete-account/', views.delete_account, name='delete_account'),
	path('change-password/', views.change_password, name='change_password'),
	path('get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
	path('game/', views.game_view, name='game'),
	path('check-auth/', views.check_authentication, name='check_authentication'),
	path('<str:lang>/', views.index_lang),
	path('<str:lang>/<path:any>/', views.index_lang)
]