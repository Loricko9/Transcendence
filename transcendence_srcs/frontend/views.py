from django.shortcuts import render, redirect # type: ignore
from django.contrib.auth import authenticate, login # type: ignore
from django.http import HttpResponse # type: ignore
from django.template import loader # type: ignore
from django.contrib import messages # type: ignore

# Create your views here.
def index(request, any=None):
	return (render(request, 'index.html'))

def login(request):
	if request.method == 'POST':
		email = request.Post['email']
		password = request.POST['password']
		user = authenticate(request, Email=email, password=password)
		if user is not None:
			login(request, user)
			messages.success(request, "Bienvenue { 'user.Email' }")
			return redirect('/')
		else:
			return HttpResponse("Invalid login details", status=401)