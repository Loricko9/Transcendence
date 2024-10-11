from django.urls import path, include
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('<str:lang>/', views.index_lang),
	path('<str:lang>/<path:any>/', views.index_lang)
]