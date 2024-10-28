all:
	@docker-compose -f Docker-compose.yml up -d --build
stop:
	@docker-compose -f Docker-compose.yml stop
down:
	@docker-compose -f Docker-compose.yml down -v
	@docker system prune -af
re: down all