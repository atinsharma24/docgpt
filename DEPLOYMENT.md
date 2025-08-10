# 🚀 DocGPT Deployment Guide

## Overview
DocGPT is a full-stack AI-powered document question-answering application built by **Atin Sharma**. This guide covers multiple deployment options from local development to production cloud deployment.

## 📋 Prerequisites
- Docker and Docker Compose
- Git
- 4GB+ RAM (for Ollama models)
- 10GB+ disk space

## 🐳 Option 1: Docker Deployment (Recommended)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/atinsharma24/docgpt.git
cd docgpt-assistant

# Build and run with Docker Compose
docker-compose up --build
```

### Access the Application
- **Frontend**: http://localhost:8000
- **API**: http://localhost:8000/api/
- **Ollama**: http://localhost:11434

## ☁️ Option 2: Cloud Deployment

### A. Railway Deployment
1. Fork the repository on GitHub
2. Connect to Railway: https://railway.app
3. Create new project from GitHub repo
4. Set environment variables:
   ```
   PORT=8000
   ALLOWED_HOSTS=*.railway.app
   DEBUG=False
   ```
5. Deploy automatically

### B. Render Deployment
1. Fork the repository
2. Connect to Render: https://render.com
3. Create new Web Service
4. Set build command: `pip install -r backend/requirements.txt`
5. Set start command: `cd backend && python manage.py runserver 0.0.0.0:$PORT`

### C. Heroku Deployment
```bash
# Install Heroku CLI and login
heroku create your-docgpt-app

# Set environment variables
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=your-docgpt-app.herokuapp.com

# Deploy
git push heroku main
```

### D. DigitalOcean App Platform
1. Fork repository
2. Create new App on DigitalOcean
3. Connect GitHub repository
4. Configure build settings:
   - Build command: `pip install -r backend/requirements.txt`
   - Run command: `cd backend && python manage.py runserver 0.0.0.0:8080`

## 🖥️ Option 3: VPS/Server Deployment

### Ubuntu/Debian Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3 python3-pip nginx git -y

# Clone repository
git clone https://github.com/atinsharma24/docgpt.git
cd docgpt-assistant

# Install Python dependencies
cd backend
pip3 install -r requirements.txt

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve &
ollama pull llama3:latest

# Run migrations
python3 manage.py migrate

# Start application
python3 manage.py runserver 0.0.0.0:8000
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/docgpt-assistant/backend/static/;
    }

    location /media/ {
        alias /path/to/docgpt-assistant/backend/media/;
    }
}
```

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Production settings
DEBUG=False
ALLOWED_HOSTS=your-domain.com,localhost
SECRET_KEY=your-secret-key-here

# Optional: Database (default: SQLite)
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### Docker Environment File (.env)
```bash
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
SECRET_KEY=your-production-secret-key
```

## 📊 Performance Optimization

### For Production
1. **Use Gunicorn**: `gunicorn docgpt.wsgi:application --bind 0.0.0.0:8000`
2. **Enable Caching**: Add Redis for caching
3. **Static Files**: Use CDN for static files
4. **Database**: Use PostgreSQL for production
5. **Monitoring**: Add logging and monitoring

### Ollama Model Optimization
```bash
# Use smaller models for faster response
ollama pull phi3:mini        # 2.3GB
ollama pull gemma2:2b        # 1.6GB
ollama pull qwen2:1.5b       # 934MB
```

## 🔒 Security Considerations

### Production Security
1. Set `DEBUG=False`
2. Use strong `SECRET_KEY`
3. Configure `ALLOWED_HOSTS`
4. Enable HTTPS
5. Set up firewall rules
6. Regular security updates

### File Upload Security
- File type validation (PDF only)
- File size limits (10MB)
- Secure file storage
- Input sanitization

## 📈 Scaling Options

### Horizontal Scaling
1. **Load Balancer**: Nginx/HAProxy
2. **Multiple Instances**: Docker Swarm/Kubernetes
3. **Database**: Separate DB server
4. **File Storage**: S3/MinIO for uploads

### Vertical Scaling
1. **CPU**: More cores for Ollama processing
2. **RAM**: 8GB+ for multiple models
3. **Storage**: SSD for faster model loading

## 🐛 Troubleshooting

### Common Issues
1. **Ollama Connection Failed**:
   ```bash
   # Check Ollama service
   ollama ps
   ollama serve
   ```

2. **Model Loading Issues**:
   ```bash
   # Pull models manually
   ollama pull llama3:latest
   ollama pull phi3:latest
   ```

3. **Port Conflicts**:
   ```bash
   # Check port usage
   netstat -tulpn | grep :8000
   netstat -tulpn | grep :11434
   ```

4. **Permission Issues**:
   ```bash
   # Fix file permissions
   chmod +x start.sh
   chown -R $USER:$USER .
   ```

## 📞 Support

### Getting Help
- **GitHub Issues**: https://github.com/atinsharma24/docgpt/issues
- **Documentation**: Check README.md
- **Logs**: Check Django and Ollama logs

### System Requirements
- **Minimum**: 4GB RAM, 2 CPU cores, 10GB storage
- **Recommended**: 8GB RAM, 4 CPU cores, 20GB storage
- **Operating System**: Linux (Ubuntu/Debian), macOS, Windows

## 🎯 Deployment Checklist

### Pre-deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Static files configured
- [ ] SSL certificates (for HTTPS)

### Post-deployment
- [ ] Application accessible
- [ ] File upload working
- [ ] AI responses working
- [ ] Document management functional
- [ ] Error handling tested
- [ ] Performance monitoring setup

---

**Built by Atin Sharma** - A complete AI-powered document question-answering system with robust fallback mechanisms and modern UI/UX.
