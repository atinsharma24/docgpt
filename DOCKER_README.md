# 🤖 DocGPT Assistant - AI-Powered Document Q&A

**Built by Atin Sharma**

[![Docker Pulls](https://img.shields.io/docker/pulls/atinsharma24/docgpt-assistant)](https://hub.docker.com/r/atinsharma24/docgpt-assistant)
[![Docker Image Size](https://img.shields.io/docker/image-size/atinsharma24/docgpt-assistant/latest)](https://hub.docker.com/r/atinsharma24/docgpt-assistant)
[![GitHub](https://img.shields.io/github/license/atinsharma24/docgpt)](https://github.com/atinsharma24/docgpt)

## 🚀 Quick Start

```bash
# Run DocGPT Assistant (one command!)
docker run -p 8000:8000 -p 11434:11434 atinsharma24/docgpt-assistant:latest

# Access at: http://localhost:8000
```

## ✨ Features

- 🤖 **AI-Powered Q&A**: Ask questions about your PDF documents
- 📄 **PDF Processing**: Upload and process documents with text extraction
- 🔍 **Semantic Search**: ChromaDB vector store for intelligent document search
- 🆓 **Completely Free**: Uses local Ollama LLM models (no API costs!)
- 📱 **Modern UI**: Responsive React interface with document management
- 🔄 **Robust Fallbacks**: Multiple AI models with text processing fallback
- 🐳 **Docker Ready**: One-command deployment

## 🏃‍♂️ Usage Options

### Option 1: Direct Run (Recommended)
```bash
docker run -p 8000:8000 -p 11434:11434 atinsharma24/docgpt-assistant:latest
```

### Option 2: With Persistent Storage
```bash
docker run -p 8000:8000 -p 11434:11434 \
  -v docgpt_data:/app/chroma_db \
  -v docgpt_uploads:/app/uploads \
  atinsharma24/docgpt-assistant:latest
```

### Option 3: Docker Compose
```yaml
version: '3.8'
services:
  docgpt:
    image: atinsharma24/docgpt-assistant:latest
    ports:
      - "8000:8000"
      - "11434:11434"
    volumes:
      - docgpt_data:/app/chroma_db
      - docgpt_uploads:/app/uploads
    environment:
      - DEBUG=False
      - ALLOWED_HOSTS=localhost,127.0.0.1

volumes:
  docgpt_data:
  docgpt_uploads:
```

## 🌐 Access Points

- **Frontend**: http://localhost:8000
- **API**: http://localhost:8000/api/
- **Ollama Service**: http://localhost:11434

## 📋 System Requirements

- **Minimum**: 4GB RAM, 2 CPU cores, 10GB storage
- **Recommended**: 8GB RAM, 4 CPU cores, 20GB storage
- **Ports**: 8000 (web), 11434 (Ollama)

## 🔧 Configuration

### Environment Variables
```bash
DEBUG=False                    # Production mode
ALLOWED_HOSTS=localhost        # Allowed hosts
SECRET_KEY=your-secret-key     # Django secret key
```

### AI Models Used
- **llama3:latest** (4.7GB) - Primary model
- **phi3:latest** (2.3GB) - Fallback model  
- **gemma2:2b** (1.6GB) - Lightweight fallback
- **Text Processing** - Final fallback

## 🚀 How It Works

1. **Upload PDF**: Upload your PDF documents through the web interface
2. **Processing**: Documents are parsed, chunked, and embedded using ChromaDB
3. **Ask Questions**: Natural language questions about your documents
4. **AI Answers**: Local Ollama LLM provides intelligent responses
5. **Manage Documents**: View, delete, and get statistics on your documents

## 🐛 Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check if ports are available
netstat -tulpn | grep -E ':(8000|11434)'

# Run with different ports if needed
docker run -p 8080:8000 -p 11435:11434 atinsharma24/docgpt-assistant:latest
```

**Out of memory:**
```bash
# Increase Docker memory limit to 6GB+
# Or use lighter models by setting environment variable
docker run -e OLLAMA_MODELS="phi3:latest,gemma2:2b" atinsharma24/docgpt-assistant:latest
```

**Slow AI responses:**
- First run downloads AI models (may take time)
- Subsequent runs are faster
- Ensure sufficient RAM allocation

## 📊 Architecture

- **Frontend**: React 19.x with modern UI components
- **Backend**: Django 5.x with REST API
- **AI**: Ollama local LLM service
- **Vector Store**: ChromaDB for semantic search
- **Database**: SQLite (default) or PostgreSQL
- **Containerization**: Docker with multi-stage builds

## 🔗 Links

- **GitHub Repository**: https://github.com/atinsharma24/docgpt
- **Documentation**: [README.md](https://github.com/atinsharma24/docgpt/blob/main/README.md)
- **Deployment Guide**: [DEPLOYMENT.md](https://github.com/atinsharma24/docgpt/blob/main/DEPLOYMENT.md)
- **Issues**: https://github.com/atinsharma24/docgpt/issues

## 📄 License

MIT License - see [LICENSE](https://github.com/atinsharma24/docgpt/blob/main/LICENSE) file

## 🙏 Support

If you find this project helpful:
- ⭐ Star the [GitHub repository](https://github.com/atinsharma24/docgpt)
- 🐛 Report issues or suggest features
- 🔄 Share with others who might benefit

---

**Built with ❤️ by Atin Sharma**

*Making AI-powered document analysis accessible to everyone, completely free!*
