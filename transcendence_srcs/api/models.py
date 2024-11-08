from django.db import models # type: ignore
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager # type: ignore
import uuid # permet de générer des identifiants uniques appelés UUIDs (Universally Unique Identifiers, ou identifiants universellement uniques).
# Create your models here.

#Class permetant de gérer le tableau User_tab (fonctions ajout, modif et suppr User)
class User_tabManager(BaseUserManager):
	def Add_User(self, Email, username, password):
		if not Email:
			raise ValueError("Email manquant !")
		if User_tab.objects.filter(Email=Email).exists():
			raise ValueError("Email dèjà présent !")
		if not username:
			raise ValueError("L'utilisateur doit avoir un nom")
		if not password:
			raise ValueError("Mot de passe manquant !")
		
		New_user = self.model(
			Email = self.normalize_email(Email),
			username = username
		)
		New_user.set_password(password) #hash automatiquement le mdp A verifier
		New_user.save(using=self._db)
		
		return New_user
	
	def create_superuser(self, Email, username, password):
		super_user = self.Add_User(
			Email=Email,
			username=username,
			password=password,
		)
		super_user.is_staff = True
		super_user.is_superuser = True
		super_user.is_connected = True
		super_user.save(using=self._db)
		return super_user


#Class définissant les diférentes valeurs du tableau User_tab
class User_tab(AbstractBaseUser, PermissionsMixin):
	Email = models.EmailField(unique=True)
	username = models.CharField(max_length=255, null=True, unique=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	is_connected = models.BooleanField(default=False)
	is_email_verified = models.BooleanField(default=False)
	verification_token = models.UUIDField(default=uuid.uuid4, editable=False) # génère un UUID de type 4 aleatoire
	nb_win = models.IntegerField(default=0)
	nb_lose = models.IntegerField(default=0)
	#Mdp automatiquement heriter de la class AbstractBaseUser
	#Mais a rajouter pour un hash de mdp manuel

	objects = User_tabManager() #Permet d'ajouter les fonctions d'ajout

	USERNAME_FIELD = 'Email'
	REQUIRED_FIELDS = ['username']

	def __str__(self):
		return self.username

	def connect(self):
		self.is_connected = True
		self.save()

	def disconnect(self):
		self.is_connected = False
		self.save()