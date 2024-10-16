from django.contrib import admin
from .models import TextTranslation

# Register your models here.
class TextTranslationAdmin(admin.ModelAdmin):
	list_display = ('Key', 'Lang', 'Text')

admin.site.register(TextTranslation, TextTranslationAdmin)