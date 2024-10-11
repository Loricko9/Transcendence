FROM debian:bookworm
RUN apt update && \
	apt install -y postgresql postgresql-contrib

EXPOSE 5432

COPY postgresql.conf /etc/postgresql/15/main/postgresql.conf
COPY pg_hba.conf /etc/postgresql/15/main/pg_hba.conf
COPY setup.sh /setup.sh

ENTRYPOINT [ "/setup.sh" ]