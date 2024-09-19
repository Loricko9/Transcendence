# Transcendance

The lastr project of 42cursus

## Execution

First of all you need to create the directory for the database
````sh
mkdir database
````
Next you need to change the path of each volume in the file `docker-compose.yml` in volume section & device for each one: PostgreSQL to the directory you want to create and Django to the directory `transcendance_srcs`

Finelly you can execute the docker
````sh
docker compose up --build
````
And access to the web site at : `localhost:8000`