# Multi-stage Docker build for DocGPT
FROM node:18-alpine AS frontend-build

# Build React frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Python backend with Ollama support
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Set working directory
WORKDIR /app

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./static/

# Create necessary directories
RUN mkdir -p media uploads chroma_db

# Expose ports
EXPOSE 8000 11434

# Start script
COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]
