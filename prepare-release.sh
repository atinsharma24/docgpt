#!/bin/bash

# DocGPT Release Preparation Script
# Built by Atin Sharma

set -e

echo "🚀 DocGPT Release Preparation"
echo "============================="

# Configuration
VERSION=${1:-"v1.0.0"}
RELEASE_DIR="./release"

echo "📋 Preparing release: $VERSION"

# Create release directory
mkdir -p $RELEASE_DIR

echo "🔧 Building Docker image..."
docker build -t docgpt-assistant:$VERSION -t docgpt-assistant:latest .

echo "💾 Exporting Docker image..."
docker save docgpt-assistant:$VERSION | gzip > $RELEASE_DIR/docgpt-assistant-$VERSION-docker.tar.gz

echo "📦 Creating source archives..."
git archive --format=tar.gz --prefix=docgpt-assistant-$VERSION/ HEAD > $RELEASE_DIR/docgpt-assistant-$VERSION-source.tar.gz
git archive --format=zip --prefix=docgpt-assistant-$VERSION/ HEAD > $RELEASE_DIR/docgpt-assistant-$VERSION-source.zip

echo "📝 Creating release notes..."
cat > $RELEASE_DIR/RELEASE_NOTES.md << EOF
# DocGPT Assistant $VERSION

**Built by Atin Sharma**

## 🚀 Features

- 🤖 **AI-Powered Q&A**: Ask questions about your PDF documents
- 📄 **Document Processing**: Upload and process PDF files
- 🔍 **Semantic Search**: ChromaDB vector store for intelligent search
- 🆓 **Completely Free**: Uses local Ollama LLM models (no API costs)
- 📱 **Modern UI**: Responsive React interface with document management
- 🐳 **Docker Ready**: Containerized for easy deployment
- 🔄 **Robust Fallbacks**: Multiple AI models with text processing fallback

## 📦 Installation Options

### Option 1: Docker (Recommended)
\`\`\`bash
# Load Docker image
gunzip docgpt-assistant-$VERSION-docker.tar.gz
docker load -i docgpt-assistant-$VERSION-docker.tar

# Run container
docker run -p 8000:8000 -p 11434:11434 docgpt-assistant:$VERSION
\`\`\`

### Option 2: Docker Compose
\`\`\`bash
# Extract source
tar -xzf docgpt-assistant-$VERSION-source.tar.gz
cd docgpt-assistant-$VERSION

# Run with Docker Compose
docker-compose up --build
\`\`\`

### Option 3: Manual Installation
\`\`\`bash
# Extract source
tar -xzf docgpt-assistant-$VERSION-source.tar.gz
cd docgpt-assistant-$VERSION

# Install dependencies
cd backend && pip install -r requirements.txt
cd ../frontend && npm install

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve &
ollama pull llama3:latest

# Run backend
cd ../backend
python manage.py migrate
python manage.py runserver &

# Run frontend
cd ../frontend
npm start
\`\`\`

## 🌐 Access Application

- **Frontend**: http://localhost:8000 (Docker) or http://localhost:3000 (Manual)
- **API**: http://localhost:8000/api/
- **Ollama**: http://localhost:11434

## 📋 System Requirements

- **Minimum**: 4GB RAM, 2 CPU cores, 10GB storage
- **Recommended**: 8GB RAM, 4 CPU cores, 20GB storage
- **OS**: Linux, macOS, Windows (with Docker)

## 🔧 Configuration

### Environment Variables
\`\`\`bash
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
SECRET_KEY=your-secret-key-here
\`\`\`

### Ollama Models
- **llama3:latest** (4.7GB) - Primary model
- **phi3:latest** (2.3GB) - Fallback model
- **gemma2:2b** (1.6GB) - Lightweight fallback

## 🐛 Troubleshooting

### Common Issues
1. **Ollama Connection**: Ensure Ollama service is running
2. **Port Conflicts**: Check ports 8000 and 11434 are available
3. **Memory Issues**: Ensure sufficient RAM for AI models

### Getting Help
- **GitHub Issues**: https://github.com/atinsharma24/docgpt/issues
- **Documentation**: Check README.md and DEPLOYMENT.md

## 📊 What's New in $VERSION

- Complete DocGPT implementation with robust LLM system
- Ollama integration with multiple model fallbacks
- Modern React UI with document management features
- Comprehensive error handling and user feedback
- Production-ready deployment configurations
- Docker containerization for easy distribution

---

**Built with ❤️ by Atin Sharma**
EOF

echo "📊 Release summary:"
echo "=================="
ls -lh $RELEASE_DIR/

echo "✅ Release preparation completed!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Review release files in: $RELEASE_DIR/"
echo "2. Create GitHub release:"
echo "   git tag $VERSION"
echo "   git push origin $VERSION"
echo "3. Upload release assets to GitHub"
echo "4. Publish Docker image to registry"
echo ""
echo "🐳 Docker commands:"
echo "=================="
echo "# Test the image locally:"
echo "docker run -p 8000:8000 -p 11434:11434 docgpt-assistant:$VERSION"
echo ""
echo "# Push to GitHub Container Registry:"
echo "docker tag docgpt-assistant:$VERSION ghcr.io/atinsharma24/docgpt:$VERSION"
echo "docker push ghcr.io/atinsharma24/docgpt:$VERSION"
