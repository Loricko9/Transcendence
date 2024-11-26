from django.urls import path # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('<str:lang>/', views.index_lang),
	path('<str:lang>/<path:any>/', views.index_lang)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)