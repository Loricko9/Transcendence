#!/bin/bash

# Fonction pour vérifier si une base de données existe
database_exists() {
    su - postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname='$DATABASE_NAME';\"" | grep -q 1
}

# Fonction pour vérifier si un utilisateur existe
user_exists() {
    su - postgres -c "psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='$DATABASE_USER';\"" | grep -q 1
}

# 1ere commande pour verifier si les fichier de base sont present dans la database et les crée sinon met une err (normal)
su - postgres -c "/usr/lib/postgresql/15/bin/pg_ctl initdb -D /var/lib/postgresql/15/main"
echo "-----------------------------------------------------"

# Démarrage de postgre (process secondaire) pour la configuration
service postgresql start

# Vérifier si l'utilisateur existe déjà
if user_exists "$DATABASE_USER"; then
    echo "L'utilisateur $DATABASE_USER existe déjà."
else
    # Créer l'utilisateur si non existant
    echo "Création de l'utilisateur $DATABASE_USER..."
    su - postgres -c "psql -c \"CREATE USER $DATABASE_USER WITH PASSWORD '$DATABASE_PASSWORD';\""
	service postgresql restart
fi

# Vérifier si la base de données existe déjà
if database_exists "$DATABASE_NAME"; then
    echo "La base de données $DATABASE_NAME existe déjà."
else
    # Créer la base de données si non existante
    echo "Création de la base de données $DATABASE_NAME..."
    su - postgres -c "psql -U postgres -c \"CREATE DATABASE $DATABASE_NAME OWNER $DATABASE_USER;\""
    # Accorder tous les droits à l'utilisateur sur la base de données
    echo "Accord des privilèges à l'utilisateur $DATABASE_USER..."
    su - postgres -c "psql -U postgres -c \"GRANT ALL PRIVILEGES ON DATABASE $DATABASE_NAME TO $DATABASE_USER;\""
	service postgresql restart
fi

echo "Configuration terminée."

# Permet de mettre postgre en prosses principal
service postgresql stop
exec su - postgres -c "/usr/lib/postgresql/15/bin/postgres -D /etc/postgresql/15/main"