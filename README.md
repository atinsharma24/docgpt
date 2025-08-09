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

