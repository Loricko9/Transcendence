FROM debian:bookworm

RUN apt update && \
	apt install -y postgresql-client

ADD https://github.com/prometheus-community/postgres_exporter/releases/download/v0.16.0/postgres_exporter-0.16.0.linux-amd64.tar.gz /
RUN tar -xvzf /postgres_exporter-0.16.0.linux-amd64.tar.gz -C / && \
	mv /postgres_exporter-0.16.0.linux-amd64/postgres_exporter /usr/local/bin && \
	rm -rf /postgres_exporter-0.16.0.linux-amd64 /postgres_exporter-0.16.0.linux-amd64.tar.gz

EXPOSE 9187

ENTRYPOINT ["postgres_exporter"]