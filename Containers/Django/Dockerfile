FROM debian:bookworm
RUN apt update && \
	apt install -y python3 python3-django python3-psycopg2 postgresql-client
	
WORKDIR /transcendence

CMD ["bash", "-c", "sleep 10 && python3 manage.py runserver 0.0.0.0:8000"]