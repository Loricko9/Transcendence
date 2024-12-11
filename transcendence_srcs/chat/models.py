from django.db import models # type: ignore
from django.utils.timezone import now # type: ignore
from django.contrib.auth import get_user_model # type: ignore

User = get_user_model()

class ChatMessage(models.Model):
	# room_name = models.CharField(max_length=100)  # Identifiant de la salle
	room = models.ForeignKey('api.Friendship',
							on_delete=models.CASCADE,
							related_name='messages',
							null=True,  # Permet des valeurs NULL
							blank=True  # Permet de laisser vide dans les formulaires
	)
	# sender = models.CharField(max_length=100)  # Par exemple, le nom d'utilisateur
	sender = models.ForeignKey(User, on_delete=models.CASCADE)
	content = models.TextField()  # Message
	timestamp = models.DateTimeField(default=now)  # Date et heure d'envoi

	def __str__(self):
		return f"[{self.timestamp}] {self.sender.username}: {self.content}"
