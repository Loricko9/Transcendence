FROM debian:bookworm

# Installer Nginx et OpenSSL
RUN apt-get update && apt-get install -y \
    nginx \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Créer les répertoires nécessaires
RUN mkdir -p /etc/nginx/certs

# Copier le certificat et la clé dans le container
COPY ./certs/selfsigned.crt /etc/nginx/certs/selfsigned.crt
COPY ./certs/selfsigned.key /etc/nginx/certs/selfsigned.key

# Copier la configuration Nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Exposer le port 443
EXPOSE 443

# Démarrer Nginx au démarrage du container
CMD ["nginx", "-g", "daemon off;"]
