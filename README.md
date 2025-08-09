# 📄 DocGPT Assistant

An **LLM-powered document question-answering web app** built with:
- **Backend:** Django + Django REST Framework + Celery
- **Frontend:** React + Vite + TailwindCSS
- **Vector Store:** FAISS (with option for Milvus/Weaviate)
- **LLM API:** OpenAI (easily swappable to local models)
- **Database:** PostgreSQL
- **Background Tasks:** Redis + Celery workers

---

## 🚀 Features
- **Upload documents** (PDF, DOCX, TXT)
- **Automatic text extraction** and chunking
- **Embeddings generation** using OpenAI or local models
- **Semantic search** with FAISS
- **Conversational Q&A** over your uploaded documents
- **Source citations** in answers
- **Authentication** with JWT
- **Async processing** with Celery + Redis

---

## 🗂 Project Structure

docgpt-assistant/
├── backend/
│   ├── core/                         # Main Django app
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── llm_utils.py              # LLM + embeddings helper functions
│   │   ├── models.py                  # Django models
│   │   ├── serializers.py             # DRF serializers
│   │   ├── tasks.py                    # Celery tasks for ingestion
│   │   ├── utils.py                    # Text extraction, chunking, etc.
│   │   ├── vector_store.py             # FAISS wrapper
│   │   ├── views.py                    # API endpoints
│   │   └── urls.py
│   ├── docgpt/                        # Django project config
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── celery.py                   # Celery app config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.override.yml     # Dev overrides
│   └── docker-compose.yml              # Main compose file
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBox.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── Message.jsx
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx
│   │   │   └── UploadPage.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .env.example                       # Example env vars
├── README.md
└── LICENSE
