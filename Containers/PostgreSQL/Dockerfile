FROM debian:bookworm
RUN apt update && \
	apt install -y postgresql

EXPOSE 5432

COPY postgresql.conf /etc/postgresql/15/main/postgresql.conf
COPY pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
COPY setup.sh /setup.sh

RUN chmod 755 setup.sh

USER postgres
RUN chmod 700 /var/lib/postgresql/15/main

# Revenir à l'utilisateur root pour continuer l'installation
USER root

# Copier les fichiers de configuration
RUN chmod 755 /etc/postgresql/15/main/postgresql.conf
RUN chmod 755 /etc/postgresql/15/main/pg_hba.conf

# ENTRYPOINT [ "/setup.sh" ]
CMD [ "/setup.sh" ]