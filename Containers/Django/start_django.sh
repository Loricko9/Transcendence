#!/bin/bash

sleep 20
python3 manage.py makemigrations api
python3 manage.py makemigrations frontend
python3 manage.py migrate
python3 manage.py setup_translation

exec python3 manage.py runserver 0.0.0.0:8000