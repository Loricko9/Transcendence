from django.contrib import admin # type: ignore
from api.models import User_tab, History, Friendship

# Adjust display of user in table
class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'Email')

class Admin_History(admin.ModelAdmin):
	list_display = ('date', 'user', 'enemy', 'score')

class Admin_Friends(admin.ModelAdmin):
	list_display = ('id', 'sender', 'receiver', 'status')

# save User_tab on admin site
admin.site.register(User_tab, UserAdmin)
admin.site.register(History, Admin_History)
admin.site.register(Friendship, Admin_Friends)