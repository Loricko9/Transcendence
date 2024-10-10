import os
import django # type: ignore

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence_srcs.settings')
django.setup()

from django.contrib.auth import get_user_model # type: ignore


User = get_user_model()

username_given = os.getenv('ADMIN_NAME')
email_given = os.getenv('ADMIN_EMAIL')
password_given = os.getenv('ADMIN_PASSWORD')

# Crée un super utilisateur s'il n'existe pas déjà
if not User.objects.filter(username=username_given).exists():
    User.objects.create_superuser(
        username=username_given,
        Email=email_given,
        password=password_given
    )
    print("Super utilisateur créé.")
else:
    print("Le super utilisateur existe déjà.")
