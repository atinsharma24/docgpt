#!/bin/bash

# DocGPT Docker Hub Distribution Script
# Built by Atin Sharma

set -e

echo "🐳 DocGPT Docker Hub Distribution"
echo "=================================="

# Configuration
DOCKER_USERNAME=${1:-"atinsharma24"}
IMAGE_NAME="docgpt-assistant"
VERSION="v1.0.0"
DOCKERHUB_REPO="$DOCKER_USERNAME/$IMAGE_NAME"

echo "📋 Configuration:"
echo "  Docker Hub Username: $DOCKER_USERNAME"
echo "  Image Name: $IMAGE_NAME"
echo "  Version: $VERSION"
echo "  Docker Hub Repository: $DOCKERHUB_REPO"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if user is logged in to Docker Hub
echo "🔐 Checking Docker Hub authentication..."
if ! docker info | grep -q "Username"; then
    echo "⚠️  You are not logged in to Docker Hub."
    echo "Please run: docker login"
    echo "Enter your Docker Hub credentials when prompted."
    read -p "Press Enter after logging in to continue..."
fi

# Build the Docker image if it doesn't exist
if ! docker images | grep -q "$IMAGE_NAME.*$VERSION"; then
    echo "🔨 Building Docker image..."
    docker build -t $IMAGE_NAME:$VERSION -t $IMAGE_NAME:latest .
else
    echo "✅ Docker image $IMAGE_NAME:$VERSION already exists"
fi

# Tag images for Docker Hub
echo "🏷️  Tagging images for Docker Hub..."
docker tag $IMAGE_NAME:$VERSION $DOCKERHUB_REPO:$VERSION
docker tag $IMAGE_NAME:latest $DOCKERHUB_REPO:latest

# Push to Docker Hub
echo "🚀 Pushing to Docker Hub..."
echo "  Pushing $DOCKERHUB_REPO:$VERSION..."
docker push $DOCKERHUB_REPO:$VERSION

echo "  Pushing $DOCKERHUB_REPO:latest..."
docker push $DOCKERHUB_REPO:latest

echo ""
echo "✅ Successfully published to Docker Hub!"
echo ""
echo "📊 Image Information:"
echo "===================="
docker images | grep $DOCKERHUB_REPO

echo ""
echo "🌐 Public Access Instructions:"
echo "=============================="
echo "Anyone can now run your DocGPT application with:"
echo ""
echo "# Pull and run the latest version:"
echo "docker pull $DOCKERHUB_REPO:latest"
echo "docker run -p 8000:8000 -p 11434:11434 $DOCKERHUB_REPO:latest"
echo ""
echo "# Or run directly without pulling first:"
echo "docker run -p 8000:8000 -p 11434:11434 $DOCKERHUB_REPO:latest"
echo ""
echo "# Access the application at:"
echo "http://localhost:8000"
echo ""
echo "📋 Docker Hub Repository:"
echo "https://hub.docker.com/r/$DOCKERHUB_REPO"
echo ""
echo "🎉 Your DocGPT application is now publicly available!"
echo "Built with ❤️ by Atin Sharma"
