from django.core.management.base import BaseCommand
from frontend.models import TextTranslation

class Command(BaseCommand):
	help = "Ajoute les entrée à la base de donnée de text pour les différentes langues"
	
	def handle(self, *args, **options):
		TranslateList = [
			{'Key': 'Title_Register', 'Lang': 'fr', 'Text': 'Inscription à Transcendence'},
			{'Key': 'Title_Register', 'Lang': 'en', 'Text': 'Transcendence Registration'},
			{'Key': 'Title_Register', 'Lang': 'es', 'Text': 'Inscribirse en Transcendence'},
			{'Key': 'Flag_nav', 'Lang': 'fr', 'Text': '/static/img/flags/fr.png'},
			{'Key': 'Flag_nav', 'Lang': 'en', 'Text': '/static/img/flags/en.png'},
			{'Key': 'Flag_nav', 'Lang': 'es', 'Text': '/static/img/flags/es.png'},
			{'Key': 'Index_1', 'Lang': 'fr', 'Text': 'Bienvenue dans le futur du Jeux Video Gaming :'},
			{'Key': 'Index_1', 'Lang': 'en', 'Text': 'Welcome to the future of Video Gaming :'},
			{'Key': 'Index_1', 'Lang': 'es', 'Text': 'Bienvenido al futuro de los videojuegos :'},
			{'Key': 'Index_2', 'Lang': 'fr', 'Text': 'Le jeux Pong classique moderniser sous forme de tournoi en local.'},
			{'Key': 'Index_2', 'Lang': 'en', 'Text': 'The classic Pong game modernised int the form of a local tournament.'},
			{'Key': 'Index_2', 'Lang': 'es', 'Text': 'El clásico juego Pong modernizado en forma de torneo local.'},
			{'Key': 'Regis_now', 'Lang': 'fr', 'Text': 'Inscris-toi'},
			{'Key': 'Regis_now', 'Lang': 'en', 'Text': 'Register Now'},
			{'Key': 'Regis_now', 'Lang': 'es', 'Text': 'Inscríbete en'},
			{'Key': 'Log_on', 'Lang': 'fr', 'Text': 'Connecte-toi'},
			{'Key': 'Log_on', 'Lang': 'en', 'Text': 'Log on to'},
			{'Key': 'Log_on', 'Lang': 'es', 'Text': 'Conéctese a'},
			{'Key': 'Log_in', 'Lang': 'fr', 'Text': 'Connexion'},
			{'Key': 'Log_in', 'Lang': 'en', 'Text': 'Log_in'},
			{'Key': 'Log_in', 'Lang': 'es', 'Text': 'Conexión'},
			{'Key': 'Sign_in', 'Lang': 'fr', 'Text': 'Inscription'},
			{'Key': 'Sign_in', 'Lang': 'en', 'Text': 'Sign_in'},
			{'Key': 'Sign_in', 'Lang': 'es', 'Text': 'Inscripción'},
			{'Key': 'URL_Register', 'Lang': 'fr', 'Text': '/fr/sign_in/'},
			{'Key': 'URL_Register', 'Lang': 'en', 'Text': '/en/sign_in/'},
			{'Key': 'URL_Register', 'Lang': 'es', 'Text': '/es/sign_in/'},
			{'Key': 'Register_1', 'Lang': 'fr', 'Text': 'Nouveau dans le jeux'},
			{'Key': 'Register_1', 'Lang': 'en', 'Text': 'New in the game'},
			{'Key': 'Register_1', 'Lang': 'es', 'Text': 'Nuevo en el juego'},
			{'Key': 'Email_1', 'Lang': 'fr', 'Text': 'Adresse Mail'},
			{'Key': 'Email_1', 'Lang': 'en', 'Text': 'E-Mail Address'},
			{'Key': 'Email_1', 'Lang': 'es', 'Text': 'Correo electrónico'},
			{'Key': 'Email_2', 'Lang': 'fr', 'Text': 'Votre adresse mail ne sera jamais partager aux autres utilisateurs'},
			{'Key': 'Email_2', 'Lang': 'en', 'Text': 'Your Email adresse will never be shared with other users'},
			{'Key': 'Email_2', 'Lang': 'es', 'Text': 'Su dirección de correo electrónico nunca se compartirá con otros usuarios'},
			{'Key': 'Passwd_1', 'Lang': 'fr', 'Text': 'Mot de passe'},
			{'Key': 'Passwd_1', 'Lang': 'en', 'Text': 'Password'},
			{'Key': 'Passwd_1', 'Lang': 'es', 'Text': 'Contraseña'},
			{'Key': 'Passwd_2', 'Lang': 'fr', 'Text': 'Validation du mot de passe'},
			{'Key': 'Passwd_2', 'Lang': 'en', 'Text': 'Password confirmation'},
			{'Key': 'Passwd_2', 'Lang': 'es', 'Text': 'Validación de contraseña'},
			{'Key': 'Passwd_3', 'Lang': 'fr', 'Text': 'Réécrivez le mot de passe'},
			{'Key': 'Passwd_3', 'Lang': 'en', 'Text': 'Rewrite the password'},
			{'Key': 'Passwd_3', 'Lang': 'es', 'Text': 'Reescribir la contraseña'},
			{'Key': 'Click_box', 'Lang': 'fr', 'Text': 'CLICK SUR LA BOITE !!!!!!'},
			{'Key': 'Click_box', 'Lang': 'en', 'Text': 'CLICK ON THIS BOX MOTHERFUCKER !!!!!!'},
			{'Key': 'Click_box', 'Lang': 'es', 'Text': 'Haga clic en el cuadro de imbécil !!!!!'},
			{'Key': 'OK_btn', 'Lang': 'fr', 'Text': 'Confirmer'},
			{'Key': 'OK_btn', 'Lang': 'en', 'Text': 'Confirm'},
			{'Key': 'OK_btn', 'Lang': 'es', 'Text': 'Confirmar'},
			{'Key': '404_Err', 'Lang': 'fr', 'Text': 'Erreur 404 : Page non trouvée !!'},
			{'Key': '404_Err', 'Lang': 'en', 'Text': 'Error 404 : Page not found !!'},
			{'Key': '404_Err', 'Lang': 'es', 'Text': 'Error 404 : ¡Página no encontrada!'},

		]


		for trans_enter in TranslateList:
			obj, created = TextTranslation.objects.get_or_create(
				Key=trans_enter['Key'],
				Lang=trans_enter['Lang'],
				defaults={'Text': trans_enter['Text']},
			)
			
			if created:
				self.stdout.write('CREATION DE : ' + trans_enter['Key'] + ' (' + trans_enter['Lang'] + ')')
			else:
				self.stdout.write('ENTREE DEJA EXISTANTE : ' + trans_enter['Key'] + ' (' + trans_enter['Lang'] + ')')