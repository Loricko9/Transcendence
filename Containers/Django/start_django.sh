#!/bin/bash

sleep 10
python3 manage.py makemigrations api --noinput
python3 manage.py makemigrations frontend
python3 manage.py collectstatic --noinput
python3 manage.py migrate --noinput
python3 manage.py setup_translation

python3 create_superuser.py

# exec python3 manage.py runserver 0.0.0.0:8000
echo "Démarrage de Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 transcendence_srcs.wsgi:application --workers 3