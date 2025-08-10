# 📄 DocGPT Assistant

A **fully functional AI-powered document question-answering web application** that allows users to upload PDF documents and ask questions about their content using OpenAI's GPT models.

## 🚀 **Current Features (Fully Implemented)**

✅ **Document Upload System**
- Upload PDF documents through a clean web interface
- Automatic file processing and storage
- Document metadata management

✅ **AI-Powered Question Answering**
- Ask natural language questions about uploaded documents
- OpenAI GPT-3.5-turbo integration for intelligent responses
- PDF text extraction and processing

✅ **Full-Stack Web Application**
- React frontend with modern component architecture
- Django REST API backend
- Real-time frontend-backend communication

✅ **Document Management**
- List and select from uploaded documents
- Document persistence in SQLite database
- RESTful API endpoints for all operations

✅ **Production-Ready Features**
- CORS configuration for cross-origin requests
- Error handling and validation
- Environment-based configuration
- Clean, responsive user interface

---

## 🛠 **Tech Stack**

### **Backend**
- **Django 5.0+** - Web framework
- **Django REST Framework** - API development
- **OpenAI API** - AI language model integration
- **PyPDF2** - PDF text extraction
- **SQLite** - Database (easily upgradeable to PostgreSQL)
- **Python-dotenv** - Environment variable management
- **Django-CORS-headers** - Cross-origin resource sharing

### **Frontend**
- **React 19+** - User interface framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Modern JavaScript/JSX** - Component development

### **AI & ML Ready**
- **ChromaDB** - Vector database (installed, ready for implementation)
- **Sentence Transformers** - Text embeddings (installed, ready for implementation)

---

## 🗂 **Project Structure**

```
docgpt-assistant/
├── backend/                 # Django backend application
│   ├── docgpt/             # Main Django app
│   │   ├── models.py       # Document model
│   │   ├── views.py        # API views and business logic
│   │   ├── serializers.py  # DRF serializers
│   │   ├── api_urls.py     # API URL routing
│   │   ├── urls.py         # Main URL configuration
│   │   └── settings.py     # Django settings
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   ├── .env               # Environment variables (OpenAI API key)
│   └── db.sqlite3         # SQLite database
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── AskDocument.jsx
│   │   │   └── TestView.jsx
│   │   ├── api/           # API integration
│   │   │   └── api.js     # API functions
│   │   ├── App.js         # Main App component
│   │   └── index.js       # React entry point
│   ├── package.json       # Node.js dependencies
│   └── public/           # Static assets
└── README.md             # This file
```

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- Python 3.8+
- Node.js 16+
- OpenAI API key

### **1. Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Start Django development server
python manage.py runserver
```

Backend will be running at: `http://127.0.0.1:8000/`

### **2. Frontend Setup**

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start React development server
npm start
```

Frontend will be running at: `http://localhost:3000/`

---

## 🧪 **Testing Your Application**

### **1. Test API Connection**
- Visit `http://localhost:3000`
- Click **"Test API"**
- Should display: `{"message": "Hello from DocGPT!"}`

### **2. Test Document Upload**
- Click **"Upload Document"**
- Select a PDF file
- Click **"Upload"**
- Should show: `"Upload successful! Document ID: [number]"`

### **3. Test AI Question-Answering**
- Click **"Ask Question"**
- Select your uploaded document from dropdown
- Enter a question about the document
- Click **"Ask"**
- Should receive an AI-generated answer

---

## 📡 **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | API root with endpoint list |
| GET | `/api/test/` | Test API connectivity |
| POST | `/api/upload/` | Upload a PDF document |
| POST | `/api/ask/` | Ask a question about a document |
| GET | `/api/documents/` | List all uploaded documents |

### **Example API Usage**

```bash
# Test API
curl http://127.0.0.1:8000/api/test/

# Upload document
curl -X POST -F "document=@/path/to/file.pdf" http://127.0.0.1:8000/api/upload/

# Ask question
curl -X POST -H "Content-Type: application/json" \
  -d '{"question":"What is this document about?", "document_id":1}' \
  http://127.0.0.1:8000/api/ask/
```

---

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in the `backend/` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### **Django Settings**
- **DEBUG**: Currently set to `True` for development
- **ALLOWED_HOSTS**: Configured for local development
- **CORS**: Enabled for `http://localhost:3000`
- **Database**: SQLite (easily upgradeable to PostgreSQL)

---

## 🚀 **Future Enhancements**

### **Ready to Implement (Dependencies Already Installed)**
- **Vector Store Integration**: ChromaDB for semantic document search
- **Document Embeddings**: Sentence transformers for better search
- **Advanced Text Processing**: Document chunking and preprocessing

### **Potential Improvements**
- **User Authentication**: JWT-based user system
- **Multiple File Formats**: DOCX, TXT support
- **Document Management**: Delete, rename, organize documents
- **Advanced UI**: Loading states, progress bars, better styling
- **Production Deployment**: Docker, cloud deployment
- **Caching**: Redis for improved performance

---

## 🐛 **Troubleshooting**

### **Common Issues**

**Backend not starting:**
- Ensure OpenAI API key is set in `.env` file
- Check if port 8000 is available
- Run `python manage.py migrate` if database issues

**Frontend not connecting to backend:**
- Verify backend is running on `http://127.0.0.1:8000/`
- Check CORS settings in Django
- Ensure no firewall blocking connections

**OpenAI API errors:**
- Verify API key is valid and has credits
- Check internet connection
- Review API usage limits

---

## 📝 **License**

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 **Support**

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using Django, React, and OpenAI**
