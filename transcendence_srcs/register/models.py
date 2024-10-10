from django.db import models # type: ignore
from api.models import User_tab
from django import forms # type: ignore

class UserForm(forms.ModelForm):
	class Meta:
		model = User_tab
		exclude = ('is_active', 'is_staff', 'is_superuser')