FROM debian:bookworm
RUN apt update && \
	apt install -y python3 python3-requests python3-prometheus-client python3-flask

COPY ./django-exporter_script.py /django-exporter_script.py
EXPOSE 9118

ENTRYPOINT ["python3", "/django-exporter_script.py"]