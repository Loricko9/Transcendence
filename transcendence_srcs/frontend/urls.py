from django.urls import path # type: ignore
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('login/', views.login_view, name='login'),
	path('<path:any>/', views.index),
]