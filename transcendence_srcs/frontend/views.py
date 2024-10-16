from django.shortcuts import render, redirect # type: ignore
from django.contrib.auth import authenticate, login # type: ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from django.http import JsonResponse # type: ignore
import logging

logger = logging.getLogger(__name__)

# @csrf_exempt  # Ajoutez ceci pour autoriser les requêtes sans le token CSRF, mais ce n'est pas recommandé pour les requêtes POST sensibles.
def login_view(request):
	if request.method == 'POST':
		email = request.POST.get('email')
		password = request.POST.get('password')

		logger.info(f"Tentative de connexion avec l'email: {email}")  # Log pour voir si la vue est appelée

		user = authenticate(request, Email=email, password=password)
        
		if user is not None:
			login(request, user)
			logger.info(f"Connexion réussie pour: {email}")  # Log pour voir si la connexion a réussi
			return JsonResponse({'success': True})
		else:
			logger.info(f"Échec de la connexion pour: {email}")  # Log pour les échecs
			return JsonResponse({'success': False, 'error': 'Identifiants invalides.'})
	logger.info("Méthode non autorisée")  # Log pour les méthodes autres que POST
	return JsonResponse({'success': False, 'error': 'Méthode non autorisée.'})

def index(request, any=None):
	return (render(request, 'index.html'))