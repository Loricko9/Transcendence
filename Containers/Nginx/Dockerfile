FROM debian:bookworm

# Installer Nginx et OpenSSL
RUN apt-get update && apt-get install -y \
    nginx \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Créer les répertoires nécessaires
RUN mkdir -p /etc/nginx/ssl

# Générer les certificats auto-signés
RUN openssl req -x509 -nodes -out /etc/nginx/ssl/transcendence.crt -keyout /etc/nginx/ssl/transcendence.key -subj "/C=FR/ST=O/L=Perpignan/O=42/OU=42/CN=localhost/UID=gpeyre"

# Copier la configuration Nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Exposer le port 443
EXPOSE 443

RUN rm /etc/nginx/sites-enabled/default

# Démarrer Nginx au démarrage du container
CMD ["nginx", "-g", "daemon off;"]
