# Transcendence

The last project of 42cursus

## Execution

1. You need to create the directory for the database
````sh
mkdir database
````
2. You need to change the path of each volume in the file `docker-compose.yml` in volume section & device for each one: PostgreSQL to the directory you want to create and Django to the directory `transcendence_srcs`

3. You have to get the ssl certificat, if you doesn't have it modify the Dockerfile for Nginx in `docker-compose.yml` to `Dockerfie_openssl` to get a auto-signed certificat

4. You can execute the docker
````sh
docker compose up --build
````

## Access
The website is accesible from : `https://localhost/`

The administration interface from : `https://localhost/admin`

The monitoring dashboard with grafana from : `localhost:3000` 