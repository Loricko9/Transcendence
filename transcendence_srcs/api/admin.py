from django.contrib import admin # type: ignore
from api.models import User_tab

# Adjust display of user in table
class UserAdmin(admin.ModelAdmin):
	list_display = ('username', 'Email')

# save User_tab on admin site
admin.site.register(User_tab, UserAdmin)