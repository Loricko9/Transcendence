from django.shortcuts import render, redirect # type: ignore
from api.models import User_tab, User_tabManager
from django.contrib import messages # type: ignore

# Create your views here.
def register(request):
	err_msg = None
	if request.method == 'POST':
		Email = request.POST.get('Email')
		# username = request.POST.get('username') doit etre reference dans le html
		Pass1 = request.POST.get('Password1')
		Pass2 = request.POST.get('Password2')
		
		if Pass1 != Pass2:
			err_msg = "Les Mots de passes ne sont pas identiques"
		else:
			try:
				# New_user = User_tabManager.Add_User(Email=Email, username=username, Password=Pass2) ne peut marcher tant qu'on ne le recupere pas dans le html
				messages.success(request, "Compte créé avec succès")
				return redirect('/')
			except ValueError as e:
				err_msg = str(e)
	else:
		return render(request, 'register.html', {'err_msg': err_msg})