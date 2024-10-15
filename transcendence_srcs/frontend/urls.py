from django.urls import path # type: ignore
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('<path:any>/', views.index),
	path('login/', views.login_view, name='login')
]