from django.db import models

# Create your models here.
class TextTranslation(models.Model):
	Key = models.CharField(max_length=100)
	Lang = models.CharField(max_length=2)
	Text = models.TextField()

	def __str__(self):
		return f"{self.Key} ({self.Lang})"