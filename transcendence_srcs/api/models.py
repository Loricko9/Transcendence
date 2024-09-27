from django.db import models

# Create your models here.
class User_tab(models.Model):
	Email = models.EmailField(unique=True)
	Password = models.CharField(max_length=64, unique=True)
