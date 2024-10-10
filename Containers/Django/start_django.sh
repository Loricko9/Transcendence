#!/bin/bash

sleep 15
python3 manage.py makemigrations api
python3 manage.py migrate

python3 create_superuser.py

exec python3 manage.py runserver 0.0.0.0:8000