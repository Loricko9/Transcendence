from django.contrib import admin # type: ignore
from api.models import User_tab, History

# Adjust display of user in table
class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'Email')

class Admin_History(admin.ModelAdmin):
	list_display = ('date', 'user', 'enemy', 'score')

# save User_tab on admin site
admin.site.register(User_tab, UserAdmin)
admin.site.register(History, Admin_History)