from django.urls import path # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore
from . import views

urlpatterns = [
	path('data/', views.get_data, name='get_data'),
	path('log-42/', views.log_42, name='log_42'),
	path('change-password/', views.change_password, name='change_password'),
	path('lang/<str:lang>', views.set_lang, name='set_lang'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)