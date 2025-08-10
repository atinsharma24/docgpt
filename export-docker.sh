#!/bin/bash

# DocGPT Docker Export Script
# Built by Atin Sharma

set -e

echo "🐳 DocGPT Docker Export Script"
echo "==============================="

# Configuration
IMAGE_NAME="docgpt-assistant"
VERSION="v1.0.0"
EXPORT_DIR="./docker-exports"

# Create export directory
mkdir -p $EXPORT_DIR

echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME:latest -t $IMAGE_NAME:$VERSION .

echo "💾 Exporting Docker image to tar file..."
docker save -o $EXPORT_DIR/$IMAGE_NAME-$VERSION.tar $IMAGE_NAME:$VERSION

echo "🗜️ Compressing Docker image..."
gzip $EXPORT_DIR/$IMAGE_NAME-$VERSION.tar

echo "📊 Docker image information:"
docker images | grep $IMAGE_NAME

echo "📁 Export files created:"
ls -lh $EXPORT_DIR/

echo "✅ Docker export completed!"
echo ""
echo "📋 Usage Instructions:"
echo "======================"
echo "To load the Docker image on another system:"
echo "  gunzip $EXPORT_DIR/$IMAGE_NAME-$VERSION.tar.gz"
echo "  docker load -i $EXPORT_DIR/$IMAGE_NAME-$VERSION.tar"
echo ""
echo "To run the container:"
echo "  docker run -p 8000:8000 -p 11434:11434 $IMAGE_NAME:$VERSION"
echo ""
echo "To push to Docker Hub (optional):"
echo "  docker tag $IMAGE_NAME:$VERSION your-dockerhub-username/$IMAGE_NAME:$VERSION"
echo "  docker push your-dockerhub-username/$IMAGE_NAME:$VERSION"
echo ""
echo "To push to GitHub Container Registry:"
echo "  docker tag $IMAGE_NAME:$VERSION ghcr.io/atinsharma24/$IMAGE_NAME:$VERSION"
echo "  docker push ghcr.io/atinsharma24/$IMAGE_NAME:$VERSION"
