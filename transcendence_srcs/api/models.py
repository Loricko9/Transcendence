from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

# Create your models here.

#Class permetant de gérer le tableau User_tab (fonctions ajout, modif et suppr User)
class User_tabManager(BaseUserManager):
	def Add_User(self, Email, Password):
		if not Email:
			raise ValueError("Email manquant !")
		if User_tab.objects.filter(Email=Email).exists():
			raise ValueError("Email dèjà présent !")
		if not Password:
			raise ValueError("Mot de passe manquant !")
		
		Email = self.normalize_email(Email)
		New_user = self.model(Email=Email)
		New_user.set_password(Password) #hash automatiquement le mdp A verifier
		New_user.save(using=self._db)
		
		return New_user



#Class définissant les diférentes valeurs du tableau User_tab
class User_tab(AbstractBaseUser, PermissionsMixin):
	Email = models.EmailField(unique=True)
	#Mdp automatiquement heriter de la class AbstractBaseUser
	#Mais a rajouter pour un hash de mdp manuel

	objects = User_tabManager() #Permet d'ajouter les fonctions d'ajout

	USERNAME_FIELD = 'Email'
	REQUIRED_FIELDS = []
