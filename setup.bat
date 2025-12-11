@echo off
ECHO "Starting services..."
docker-compose up -d

ECHO "Waiting for Ollama to be ready..."
timeout /t 10 > nul

ECHO "Pulling models..."
docker-compose exec ollama ollama pull gemma3:1b
docker-compose exec ollama ollama pull nomic-embed-text

ECHO "Setup complete. You can now start the application."
ECHO "Run 'docker-compose logs -f app' to see the application logs."
pause
