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

		user = authenticate(request, Email=email, password=password)
        
		if user is not None:
			login(request, user)
			user.connect()
			return JsonResponse({'success': True, 'message': '<p>Connexion reussie</p>'})
		else:
			  # Log pour les échecs
			return JsonResponse({'success': False, 'message' : 'Connexion echouée', 'error': 'Identifiants invalides.'})
	logger.info("Méthode non autorisée")  # Log pour les méthodes autres que POST
	return JsonResponse({'success': False, 'error': 'Méthode non autorisée.'})

def index(request, any=None):
	return (render(request, 'index.html'))