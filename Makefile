all:
	@docker-compose -f Docker-compose.yml up -d --build

stop:
	@echo "Stopping the project..."
	@docker-compose -f Docker-compose.yml down

migrations:
	@echo "Updating the database..."
	@docker exec -it Django python3 manage.py collectstatic --noinput
	@echo "Database updated successfully!"

help:
	@echo "Usage: make [command]"
	@echo "Commands:"
	@echo "  all          - Start the project"
	@echo "  migrations   - Update the database"
	@echo "  stop         - Stop the project"
	@echo "  down         - Stop the project and remove all volumes"
	@echo "  help         - Show this help message and exit"

restart:
	@docker restart Django

down:
	@docker-compose -f Docker-compose.yml down -v
	@docker system prune -af
re: stop all