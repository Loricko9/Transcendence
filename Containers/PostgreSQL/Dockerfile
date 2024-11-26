FROM debian:bookworm
RUN apt update && \
	apt install -y postgresql postgresql-contrib

EXPOSE 5432

COPY postgresql.conf /etc/postgresql/15/main/postgresql.conf
COPY pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
COPY setup.sh /setup.sh
RUN chmod 755 setup.sh

USER postgres
# RUN rm -rf /var/lib/postgresql/15/main/*
# RUN mkdir -p /var/lib/postgresql/15/main
RUN chown -R postgres:postgres /var/lib/postgresql/15/main && chmod 700 /var/lib/postgresql/15/main

# Revenir à l'utilisateur root pour continuer l'installation
USER root

# Copier les fichiers de configuration
RUN chmod 755 /etc/postgresql/15/main/postgresql.conf
RUN chmod 755 /etc/postgresql/15/main/pg_hba.conf

ENTRYPOINT [ "/setup.sh" ]