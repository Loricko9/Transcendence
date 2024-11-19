FROM debian:bookworm

RUN apt-get update && apt-get install -y \
    nginx \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl && \
    chmod 755 /

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./fullchain1.pem /etc/nginx/ssl/fullchain1.pem
COPY ./privkey1.pem /etc/nginx/ssl/privkey1.pem

EXPOSE 443
EXPOSE 80
RUN rm /etc/nginx/sites-enabled/default

ENTRYPOINT ["nginx", "-g", "daemon off;"]