from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse

# Create your views here.
def get_data(request):
	data = {
		'message': 'test django test',
		'nb': [1,2,3,4]
	}
	return (JsonResponse(data))

def set_lang(request, lang):
	accept_lang = ['fr', 'en', 'es']
	if lang not in accept_lang:
		return redirect('/404')

	reponse = redirect(request.GET.get('prev', '/'))

	tps = 31536000
	reponse.set_cookie('language', lang, max_age=tps)
	return reponse
