from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from django.utils.translation import get_language
from .models import TextTranslation

# Create your views here.
def index(request):
	lang_cookie = request.COOKIES.get('language', None)
	
	if lang_cookie == None:
		nav_lang = get_language()
	else:
		nav_lang = lang_cookie
	
	if nav_lang == "en":
		return redirect('/en/')
	if nav_lang == "es":
		return redirect('/es/')
	else:
		return redirect('/fr/')

def index_lang(request, lang, any=None):
	lang_cookie = request.COOKIES.get('language', None)
	lang_accepted = ['fr', 'en', 'es']

	if lang_cookie != lang and lang in lang_accepted:
		return redirect('/api/lang/' + lang + "?prev=" + request.path)

	if lang in lang_accepted:
		translations = TextTranslation.objects.filter(Lang=lang)
		texts_trans = {trans.Key : trans.Text for trans in translations}
		return render(request, 'index.html', {"texts": texts_trans})
	
	if lang_cookie == None:
		nav_lang = get_language()
	else:
		nav_lang = lang_cookie

	new_path = "/" + nav_lang + request.path
	return redirect(new_path)