from django.urls import path
from . import views

urlpatterns = [
	path('data/', views.get_data, name='get_data'),
	path('log-42/', views.log_42, name='log_42'),
	path('change-password/', views.change_password, name='change_password'),
	path('lang/<str:lang>', views.set_lang, name='set_lang'),
]