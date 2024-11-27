#/bin/bash
python3 manage.py makemigrations api
python3 manage.py makemigrations frontend
python3 manage.py collectstatic --noinput
python3 manage.py migrate
python3 manage.py setup_translation