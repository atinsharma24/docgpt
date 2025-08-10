#!/bin/bash

# Start Ollama service in background
ollama serve &

# Wait for Ollama to start
sleep 5

# Pull required models (if not already present)
ollama pull llama3:latest || echo "Llama3 model already exists or failed to download"
ollama pull phi3:latest || echo "Phi3 model download failed, will use fallback"

# Run Django migrations
python manage.py migrate

# Start Django development server
python manage.py runserver 0.0.0.0:8000
