from django.db import models # type: ignore
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager # type: ignore
import uuid # permet de générer des identifiants uniques appelés UUIDs (Universally Unique Identifiers, ou identifiants universellement uniques).
from asgiref.sync import sync_to_async  # type: ignore

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
		New_user.set_password(password) #hash automatiquement le mdp
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
	avatar = models.ImageField(upload_to='avatars/', default='/media/avatars/avatar_1.png')
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)
	is_connected = models.BooleanField(default=False)
	is_email_verified = models.BooleanField(default=False)
	is_user_42 = models.BooleanField(default=False)
	verification_token = models.UUIDField(default=uuid.uuid4, editable=False) # génère un UUID de type 4 aleatoire
	nb_win = models.IntegerField(default=0)
	nb_lose = models.IntegerField(default=0)
	nb_tournament_win = models.IntegerField(default=0)
	nb_tournament_lose = models.IntegerField(default=0)
	friends = models.ManyToManyField('self', blank=True, symmetrical=True)
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
	
	def add_friend(self, friend):
		self.friends.add(friend)
		self.save()

	def remove_friend(self, friend):
		self.friends.remove(friend)
		self.save()

	def is_friend(self, friend):
		return self.friends.filter(pk=friend.pk).exists()


class Friendship(models.Model):
	sender = models.ForeignKey(User_tab, on_delete=models.CASCADE, related_name='sent_requests')
	receiver = models.ForeignKey(User_tab, on_delete=models.CASCADE, related_name='received_requests')
	status = models.CharField(
		max_length=10,
		choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')],
		default='pending'
	)
	created_at = models.DateTimeField(auto_now_add=True)
	blocked_users = models.ManyToManyField(User_tab, blank=True, related_name="blocked_by")

	async def is_blocked(self, user):
		"""Vérifie si un utilisateur est bloqué"""
		return await sync_to_async(self.blocked_users.filter(id=user.id).exists)()
	
	def is_blocked_sync(self, user):
		"""Vérifie si un utilisateur est bloqué"""
		return self.blocked_users.filter(id=user.id).exists()

	def __str__(self):
		return f"{self.sender.username} to {self.receiver.username} - Status: {self.status}"
	
class Meta:
	unique_together = ('sender', 'receiver')

class History(models.Model):
	user = models.ForeignKey(User_tab, on_delete=models.CASCADE, related_name="game_history")
	date = models.DateTimeField(auto_now_add=True)
	enemy = models.CharField(max_length=255)
	score = models.CharField(max_length=5)
	result = models.CharField(max_length=10, choices=[('Victory', 'Victory'), ('Defeat', 'Defeat')])

	def __str__(self):
		return f"{self.date} : {self.user.username} vs {self.enemy} - {self.score} -> {self.result}"
	
	@classmethod
	def Add_History(cls, user, enemy, score_user, score_enemy):
		score_forma = f"{score_user} - {score_enemy}"
		if (score_user > score_enemy) :
			result = 'Victory'
		else :
			result = 'Defeat'
		if not User_tab.objects.filter(username=enemy).exists() and not enemy == 'AI':
			raise ValueError("L'ennemy n'existe pas !")
		try :
			user_instance = User_tab.objects.get(username=user)
		except User_tab.DoesNotExist:
			raise ValueError("Le User n'existe pas !")
		new_history = cls(
			user=user_instance,
			enemy=enemy,
			score=score_forma,
			result=result
		)
		new_history.save()

		return new_history
	
class Matchmaking(models.Model):
	leader = models.ForeignKey(User_tab, on_delete=models.CASCADE, related_name="group_leader")
	members = models.ManyToManyField(User_tab, related_name="group", blank=True)
	max_members = models.PositiveIntegerField(default=1)
	mode = models.CharField(max_length=10, default='1vs1')

	def is_full(self):
		return self.members.count() >= self.max_members
	
	def add_member(self, user):
		if not self.is_full():
			self.members.add(user)
		else:
			raise ValueError("Le groupe est déjà plein.")
	
	def __str__(self):
		return f"Groupe dirigé par {self.leader.username}, {self.members.count()} membres sur {self.max_members}"
	

class Notifications(models.Model):
    user = models.ForeignKey(User_tab, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"