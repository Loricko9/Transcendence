from django.db import models # type: ignore
from django.utils.timezone import now # type: ignore

class ChatMessage(models.Model):
	room_name = models.CharField(max_length=100)  # Identifiant de la salle
	sender = models.CharField(max_length=100)  # Par exemple, le nom d'utilisateur
	content = models.TextField()  # Message
	timestamp = models.DateTimeField(default=now)  # Date et heure d'envoi

	def __str__(self):
		return f"[{self.timestamp}] {self.sender}: {self.content}"
