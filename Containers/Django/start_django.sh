#!/bin/bash

sleep 15
python3 manage.py makemigrations api
python3 manage.py migrate

exec python3 manage.py runserver 0.0.0.0:8000