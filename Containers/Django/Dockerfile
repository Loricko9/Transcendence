FROM debian:bookworm
RUN apt update && \
	apt install -y python3 python3-django python3-psycopg2 postgresql-client
	
COPY start_django.sh /start_django.sh
RUN chmod 755 start_django.sh

WORKDIR /transcendence

ENTRYPOINT [ "/start_django.sh" ]