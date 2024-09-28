from django.shortcuts import render, redirect
from api.models import User_tab, User_tabManager
from django.contrib import messages

# Create your views here.
def register(request):
	err_msg = None
	if request.method == 'POST':
		Email = request.POST.get('Email')
		Pass1 = request.POST.get('Password1')
		Pass2 = request.POST.get('Password2')
		
		if Pass1 != Pass2:
			err_msg = "Les Mots de passes ne sont pas identiques"
		else:
			try:
				New_user = User_tab.objects.Add_User(Email=Email, Password=Pass2)
				messages.success(request, "Compte créé avec succès")
				return redirect('/')
			except ValueError as e:
				err_msg = str(e)
	
	return render(request, 'register.html', {'err_msg': err_msg})