import os
import time
import logging
import requests
import json
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Document
from .serializers import DocumentSerializer
from PyPDF2 import PdfReader
from .vector_store import DocumentVectorStore

logger = logging.getLogger(__name__)

# Initialize vector store
vector_store = DocumentVectorStore()

# LLM Configuration - Multiple options for reliability
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODELS = ["llama3:latest", "llama3.2:latest", "phi3:latest", "gemma2:2b"]  # Fallback models

def call_ollama(prompt, max_tokens=1000, temperature=0.3):
    """
    Call Ollama API with fallback models for reliability
    """
    for model in OLLAMA_MODELS:
        try:
            logger.info(f"Trying Ollama model: {model}")
            response = requests.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens
                    }
                },
                timeout=30  # Reduced timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                answer = result.get("response", "")
                if answer.strip():
                    logger.info(f"Successfully got response from {model}")
                    return answer
            else:
                logger.warning(f"Ollama model {model} error: {response.status_code}")
                continue
                
        except requests.exceptions.Timeout:
            logger.warning(f"Ollama model {model} timed out, trying next model")
            continue
        except requests.exceptions.RequestException as e:
            logger.warning(f"Ollama model {model} connection error: {str(e)}")
            continue
        except Exception as e:
            logger.warning(f"Ollama model {model} error: {str(e)}")
            continue
    
    # If all Ollama models fail, use simple text processing fallback
    logger.warning("All Ollama models failed, using simple text processing fallback")
    return generate_simple_answer(prompt)

def generate_simple_answer(prompt):
    """
    Simple text processing fallback when Ollama is unavailable
    """
    try:
        # Extract question and context from prompt
        lines = prompt.split('\n')
        question = ""
        context = ""
        
        for line in lines:
            if line.startswith("Question:"):
                question = line.replace("Question:", "").strip()
            elif "Context from document" in line:
                # Find context section
                context_start = prompt.find("Context from document")
                question_start = prompt.find("Question:")
                if context_start != -1 and question_start != -1:
                    context = prompt[context_start:question_start].strip()
        
        if not question:
            return "I apologize, but I couldn't process your question. Please try again."
        
        # Simple keyword-based response generation
        context_lower = context.lower()
        question_lower = question.lower()
        
        # Extract key terms from question
        question_words = [word.strip('.,?!') for word in question_lower.split() if len(word) > 3]
        
        # Find relevant sentences from context
        relevant_sentences = []
        for sentence in context.split('.'):
            sentence = sentence.strip()
            if len(sentence) > 20:  # Ignore very short sentences
                sentence_lower = sentence.lower()
                # Check if sentence contains question keywords
                relevance_score = sum(1 for word in question_words if word in sentence_lower)
                if relevance_score > 0:
                    relevant_sentences.append((sentence, relevance_score))
        
        # Sort by relevance and take top sentences
        relevant_sentences.sort(key=lambda x: x[1], reverse=True)
        top_sentences = [sent[0] for sent in relevant_sentences[:3]]
        
        if top_sentences:
            answer = f"Based on the document, here's what I found regarding your question:\n\n"
            answer += "\n\n".join(top_sentences)
            answer += "\n\n(Note: This response was generated using simple text processing as the AI model is currently unavailable.)"
            return answer
        else:
            return f"I found information in the document, but couldn't locate specific details about '{question}'. The document contains relevant content, but you may need to rephrase your question or check the document directly for more specific information."
            
    except Exception as e:
        logger.error(f"Simple answer generation error: {str(e)}")
        return "I apologize, but I'm having trouble processing your question right now. Please try again later or contact support if the issue persists."

class TestView(APIView):
    def get(self, request):
        return Response({"message": "Hello from DocGPT! Now powered by Ollama (Free LLM)"})

class AskDocumentView(APIView):
    def post(self, request):
        doc_id = request.data.get("document_id")
        question = request.data.get("question")
        use_semantic_search = request.data.get("use_semantic_search", True)

        if not question:
            return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not doc_id:
            return Response({"error": "Document ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document = Document.objects.get(id=doc_id)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

        # Process with Ollama (Free LLM)
        
        try:
            context_text = ""
            sources = []
            
            if use_semantic_search:
                # Use vector store for semantic search
                search_results = vector_store.search_documents(
                    query=question,
                    document_id=doc_id,
                    n_results=3
                )
                
                if search_results:
                    context_text = "\n\n".join([result['text'] for result in search_results])
                    sources = [{
                        "chunk_id": result['id'],
                        "similarity": round(result['similarity'], 3),
                        "text_preview": result['text'][:200] + "..." if len(result['text']) > 200 else result['text']
                    } for result in search_results]
                else:
                    # Fallback to full document text
                    file_path = document.file.path
                    reader = PdfReader(file_path)
                    for page in reader.pages:
                        context_text += page.extract_text() + "\n"
            else:
                # Use full document text
                file_path = document.file.path
                reader = PdfReader(file_path)
                for page in reader.pages:
                    context_text += page.extract_text() + "\n"
            
            # Create enhanced prompt
            prompt = f"""Answer the following question based on the provided document context. Be specific and cite relevant information from the context.

Context from document "{document.title}":
{context_text}

Question: {question}

Please provide a comprehensive answer based on the context above. If the context doesn't contain enough information to answer the question, please state that clearly."""
            
            start_time = time.time()
            answer = call_ollama(prompt, max_tokens=1000, temperature=0.3)
            processing_time = time.time() - start_time
            
            if answer is None or not answer.strip():
                return Response(
                    {"error": "AI service is currently unavailable. Please try again in a few moments."}, 
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            return Response({
                "answer": answer,
                "document": {
                    "id": document.id,
                    "title": document.title
                },
                "question": question,
                "sources": sources if use_semantic_search else [],
                "semantic_search_used": use_semantic_search,
                "processing_time": round(processing_time, 2),
                "timestamp": time.time()
            })
            
        except Exception as e:
            logger.error(f"Error in AskDocumentView: {str(e)}")
            return Response({"error": f"Failed to process question: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def ping(request):
    return JsonResponse({"message": "DocGPT backend is running!"})


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

from django.http import JsonResponse

def test_view(request):
    return JsonResponse({"message": "DocGPT is alive!"})

class DocumentStatsView(APIView):
    def get(self, request, document_id=None):
        """Get statistics about documents in vector store"""
        try:
            stats = vector_store.get_document_stats(document_id)
            return Response({
                "success": True,
                "stats": stats,
                "timestamp": time.time()
            })
        except Exception as e:
            logger.error(f"Error getting document stats: {str(e)}")
            return Response({"error": "Failed to get document statistics"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DocumentDeleteView(APIView):
    def delete(self, request, document_id):
        """Delete a document and its vector store data"""
        try:
            # Delete from database
            document = Document.objects.get(id=document_id)
            document.delete()
            
            # Delete from vector store
            vector_store.delete_document(document_id)
            
            return Response({
                "message": "Document deleted successfully",
                "document_id": document_id,
                "timestamp": time.time()
            })
            
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {str(e)}")
            return Response({"error": "Failed to delete document"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentUploadView(APIView):
    def post(self, request, *args, **kwargs):
        if 'document' not in request.FILES:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['document']
        
        # Validate file type
        if not file.name.lower().endswith('.pdf'):
            return Response({"error": "Only PDF files are supported"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file size (max 10MB)
        if file.size > 10 * 1024 * 1024:
            return Response({"error": "File size must be less than 10MB"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create document instance
            document = Document.objects.create(
                title=file.name,
                file=file
            )
            
            # Add to vector store for semantic search
            success = vector_store.add_document(
                document_id=document.id,
                file_path=document.file.path,
                title=document.title
            )
            
            if not success:
                logger.warning(f"Failed to add document {document.id} to vector store")
            
            serializer = DocumentSerializer(document)
            return Response({
                "message": "File uploaded and processed successfully",
                "document": serializer.data,
                "vector_store_added": success,
                "processing_time": time.time()
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            return Response({"error": "Failed to upload document"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
