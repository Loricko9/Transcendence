FROM debian:bookworm

RUN apt update && \
	apt install -y adduser libfontconfig1 musl ca-certificates
ADD https://dl.grafana.com/oss/release/grafana_11.3.0+security~01_amd64.deb /
RUN dpkg -i grafana_11.3.0+security~01_amd64.deb && \
	rm -rf grafana_11.3.0+security~01_amd64.deb /etc/grafana/provisioning/datasources/sample.yaml

COPY ./grafana.ini /etc/grafana/grafana.ini
COPY ./datasources.yaml /etc/grafana/provisioning/datasources/datasources.yaml
COPY ./start.sh /start.sh
RUN chmod 755 start.sh
COPY ./dashboards /etc/grafana/provisioning/dashboards

RUN chmod +x /start.sh

ENTRYPOINT [ "/start.sh" ]