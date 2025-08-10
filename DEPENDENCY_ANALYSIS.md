# DocGPT Assistant - Dependency Analysis

## Overview
This document provides a comprehensive analysis of all dependencies used in the DocGPT Assistant project, their purposes, and version compatibility.

## Core Dependencies

### 1. Django Framework Stack
- **Django>=5.0,<6.0**: Core web framework
  - Requires Python 3.10+
  - Provides ORM, admin interface, and web framework
- **djangorestframework>=3.14.0,<4.0**: REST API framework
  - Builds on top of Django for API development
  - Provides serializers, viewsets, and authentication
- **django-cors-headers>=4.3.0,<5.0**: Cross-Origin Resource Sharing
  - Enables frontend-backend communication
  - Critical for React frontend integration

### 2. Database Layer
- **psycopg2-binary>=2.9.0,<3.0**: PostgreSQL adapter
  - Native PostgreSQL driver for Python
  - Binary distribution for easier installation
- **SQLite**: Included with Django (development default)

### 3. AI and Machine Learning
- **openai>=1.0.0,<2.0**: OpenAI API client
  - Modern OpenAI API client library
  - Replaces deprecated `openai.ChatCompletion.create()`
- **langchain>=0.1.0,<1.0**: AI framework
  - Provides tools for building AI applications
  - Includes prompt management and chain building
- **sentence-transformers>=2.2.0,<3.0**: Text embeddings
  - Generates vector embeddings for semantic search
  - Uses 'all-MiniLM-L6-v2' model for efficiency

### 4. Vector Database
- **chromadb>=0.4.0,<1.0**: Vector store
  - Stores document embeddings for semantic search
  - Provides similarity search capabilities
  - Persistent storage with metadata

### 5. Document Processing
- **PyPDF2>=3.0.0,<4.0**: PDF text extraction
  - Extracts text content from PDF documents
  - Handles various PDF formats and structures

### 6. Background Processing
- **celery>=5.3.0,<6.0**: Task queue
  - Handles asynchronous document processing
  - Integrates with Redis for message passing
- **redis>=4.5.0,<5.0**: Message broker
  - Stores task queue and session data
  - Provides caching capabilities

### 7. Utilities
- **requests>=2.31.0,<3.0**: HTTP client
  - Used for external API calls (Ollama, OpenAI)
  - Modern HTTP library with good error handling
- **python-dotenv>=1.0.0,<2.0**: Environment management
  - Loads environment variables from .env files
  - Manages configuration securely

## Development Dependencies

### Testing
- **pytest**: Testing framework
- **pytest-django**: Django-specific testing utilities
- **pytest-cov**: Coverage reporting
- **factory-boy**: Test data generation

### Code Quality
- **black**: Code formatting
- **flake8**: Linting and style checking
- **isort**: Import sorting
- **pre-commit**: Git hooks for code quality

### Development Tools
- **django-debug-toolbar**: Development debugging
- **django-extensions**: Additional Django utilities
- **django-silk**: Performance profiling

## Production Dependencies

### Security
- **gunicorn**: WSGI server for production
- **whitenoise**: Static file serving
- **Tighter version constraints** for security

## Version Compatibility Matrix

| Component | Python | Django | DRF | Notes |
|-----------|--------|--------|-----|-------|
| Core | 3.10+ | 5.0+ | 3.14+ | Main compatibility |
| Vector Store | 3.8+ | 4.0+ | 3.12+ | ChromaDB requirements |
| AI Models | 3.8+ | 4.0+ | 3.12+ | Sentence transformers |

## Dependency Conflicts Resolved

### 1. OpenAI API Version
- **Before**: Used deprecated `openai.ChatCompletion.create()`
- **After**: Uses modern `openai>=1.0.0` client

### 2. Django Version Constraints
- **Before**: `Django>=5.0` (too permissive)
- **After**: `Django>=5.0,<6.0` (prevents breaking changes)

### 3. Package Version Conflicts
- **Before**: Missing version constraints
- **After**: Specific version ranges for compatibility

### 4. Python Version Mismatch
- **Before**: Docker uses Python 3.11, system has 3.13
- **After**: Consistent Python 3.11 specification

## Installation Instructions

### Development
```bash
cd backend
pip install -r requirements-dev.txt
```

### Production
```bash
cd backend
pip install -r requirements-prod.txt
```

### Minimal
```bash
cd backend
pip install -r requirements.txt
```

## Security Considerations

1. **Version Pinning**: Specific version ranges prevent security vulnerabilities
2. **Dependency Updates**: Regular updates for security patches
3. **Environment Variables**: Sensitive data stored in .env files
4. **Production Hardening**: Additional security packages in production

## Maintenance

### Regular Tasks
1. **Monthly**: Check for security updates
2. **Quarterly**: Update dependency versions
3. **Annually**: Review and update major versions

### Update Process
1. Test in development environment
2. Run full test suite
3. Update requirements files
4. Deploy to staging
5. Deploy to production

## Troubleshooting

### Common Issues
1. **Version Conflicts**: Use virtual environments
2. **Missing Dependencies**: Check requirements file
3. **Python Version**: Ensure Python 3.11 compatibility
4. **System Dependencies**: Install build tools for binary packages

### Debug Commands
```bash
# Check installed packages
pip list

# Check for conflicts
pip check

# Verify Python version
python --version

# Check Django version
python -c "import django; print(django.get_version())"
```
