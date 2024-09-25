from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def get_data(request):
	data = {
		'message': 'test django test',
		'nb': [1,2,3,4]
	}
	return (JsonResponse(data))