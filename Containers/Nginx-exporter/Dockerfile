FROM debian:bookworm

ADD https://github.com/nginxinc/nginx-prometheus-exporter/releases/download/v1.3.0/nginx-prometheus-exporter_1.3.0_linux_amd64.tar.gz /
RUN tar -xvzf /nginx-prometheus-exporter_1.3.0_linux_amd64.tar.gz -C /usr/local/bin && \
    chmod +x /usr/local/bin/nginx-prometheus-exporter && \
	rm -rf /nginx-prometheus-exporter_1.3.0_linux_amd64.tar.gz
EXPOSE 9113

CMD ["/usr/local/bin/nginx-prometheus-exporter", "-nginx.scrape-uri=http://nginx:8080/nginx_status"]