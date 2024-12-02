FROM debian:bookworm

RUN apt-get update && apt-get install -y \
    nginx \
	# certbot \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl && \
    chmod 755 /

# RUN mkdir -p /var/www/certbot && \
# 	chmod 755 /

	
# RUN certbot certonly --webroot -w /var/www/certbot \
# 	-d transcendence-42.fr -d www.transcendence-42.fr \
# 	--email gauthpeyre@gmail.com \
# 	--agree-tos \
# 	--no-eff-email \
# 	--non-interactive

COPY ./fullchain1.pem /etc/nginx/ssl/fullchain1.pem
COPY ./privkey1.pem /etc/nginx/ssl/privkey1.pem
COPY ./default.conf /etc/nginx/conf.d/default.conf
	
EXPOSE 443
EXPOSE 80
RUN rm /etc/nginx/sites-enabled/default

ENTRYPOINT ["nginx", "-g", "daemon off;"]