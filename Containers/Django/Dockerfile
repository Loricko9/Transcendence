FROM debian:bookworm

# Créer un utilisateur
# RUN useradd -ms /bin/bash gauthdev

RUN apt update && \
	apt install -y \
	python3 \
	python3-django \
	python3-psycopg2 \
	postgresql-client \
	python3-dotenv \
	python3-pillow \
	python3-djangorestframework \
	python3-django-prometheus \
	python3-requests \
	python3-channels-redis \
	daphne

COPY start_django.sh /start_django.sh
COPY migrations.sh /migrations.sh
RUN chmod 755 start_django.sh
RUN chmod 755 migrations.sh

# COPY . /transcendence
# RUN chown -R gauthdev /transcendence

WORKDIR /transcendence
EXPOSE 8000

ENTRYPOINT [ "/start_django.sh" ]