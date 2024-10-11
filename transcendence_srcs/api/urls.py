from django.urls import path
from . import views

urlpatterns = [
	path('data/', views.get_data, name='get_data'),
	path('lang/<str:lang>', views.set_lang, name='set_lang'),
]