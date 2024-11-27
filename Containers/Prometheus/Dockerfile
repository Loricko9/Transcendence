FROM debian:bookworm

ADD https://github.com/prometheus/prometheus/releases/download/v3.0.0/prometheus-3.0.0.linux-amd64.tar.gz /
RUN tar -xvzf /prometheus-3.0.0.linux-amd64.tar.gz && \
    rm /prometheus-3.0.0.linux-amd64.tar.gz

EXPOSE 9090
WORKDIR /prometheus-3.0.0.linux-amd64

COPY prometheus.yml /prometheus-3.0.0.linux-amd64/prometheus.yml

ENTRYPOINT ["/prometheus-3.0.0.linux-amd64/prometheus", "--config.file=/prometheus-3.0.0.linux-amd64/prometheus.yml"]
