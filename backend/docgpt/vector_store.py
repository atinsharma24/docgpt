import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import os
from typing import List, Dict, Any
import uuid
from django.conf import settings
import logging
from PyPDF2 import PdfReader
import re

logger = logging.getLogger(__name__)

class DocumentVectorStore:
    """
    ChromaDB-based vector store for document embeddings and semantic search
    """
    
    def __init__(self):
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path="./chroma_db",
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Initialize sentence transformer for embeddings
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )
        
        logger.info("DocumentVectorStore initialized successfully")
    
    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """
        Split text into overlapping chunks for better semantic search
        """
        # Clean text
        text = re.sub(r'\s+', ' ', text).strip()
        
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + chunk_size
            
            # Try to break at sentence boundary
            if end < len(text):
                # Look for sentence endings
                sentence_end = text.rfind('.', start, end)
                if sentence_end > start + chunk_size // 2:
                    end = sentence_end + 1
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            start = end - overlap
            if start >= len(text):
                break
        
        return chunks
    
    def add_document(self, document_id: int, file_path: str, title: str) -> bool:
        """
        Process document, create embeddings, and store in vector database
        """
        try:
            # Extract text from PDF
            reader = PdfReader(file_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            
            if not text.strip():
                logger.warning(f"No text extracted from document {document_id}")
                return False
            
            # Chunk the text
            chunks = self.chunk_text(text)
            
            # Create embeddings and store
            chunk_ids = []
            chunk_texts = []
            chunk_metadatas = []
            
            for i, chunk in enumerate(chunks):
                chunk_id = f"doc_{document_id}_chunk_{i}"
                chunk_ids.append(chunk_id)
                chunk_texts.append(chunk)
                chunk_metadatas.append({
                    "document_id": document_id,
                    "title": title,
                    "chunk_index": i,
                    "total_chunks": len(chunks)
                })
            
            # Generate embeddings
            embeddings = self.embedding_model.encode(chunk_texts).tolist()
            
            # Add to ChromaDB
            self.collection.add(
                ids=chunk_ids,
                documents=chunk_texts,
                metadatas=chunk_metadatas,
                embeddings=embeddings
            )
            
            logger.info(f"Successfully added document {document_id} with {len(chunks)} chunks")
            return True
            
        except Exception as e:
            logger.error(f"Error adding document {document_id}: {str(e)}")
            return False
    
    def search_documents(self, query: str, document_id: int = None, n_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search for relevant document chunks based on query
        """
        try:
            # Create query embedding
            query_embedding = self.embedding_model.encode([query]).tolist()[0]
            
            # Prepare where clause for filtering by document_id
            where_clause = None
            if document_id:
                where_clause = {"document_id": document_id}
            
            # Search in ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where=where_clause,
                include=["documents", "metadatas", "distances"]
            )
            
            # Format results
            formatted_results = []
            for i in range(len(results['ids'][0])):
                formatted_results.append({
                    'id': results['ids'][0][i],
                    'text': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i],
                    'similarity': 1 - results['distances'][0][i]  # Convert distance to similarity
                })
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"Error searching documents: {str(e)}")
            return []
    
    def delete_document(self, document_id: int) -> bool:
        """
        Delete all chunks for a specific document
        """
        try:
            # Get all chunk IDs for this document
            results = self.collection.get(
                where={"document_id": document_id},
                include=["metadatas"]
            )
            
            if results['ids']:
                self.collection.delete(ids=results['ids'])
                logger.info(f"Deleted {len(results['ids'])} chunks for document {document_id}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {str(e)}")
            return False
    
    def get_document_stats(self, document_id: int = None) -> Dict[str, Any]:
        """
        Get statistics about stored documents
        """
        try:
            where_clause = None
            if document_id:
                where_clause = {"document_id": document_id}
            
            results = self.collection.get(
                where=where_clause,
                include=["metadatas"]
            )
            
            if document_id:
                return {
                    "document_id": document_id,
                    "total_chunks": len(results['ids']),
                    "chunks": results['metadatas'] if results['metadatas'] else []
                }
            else:
                # Get stats for all documents
                doc_stats = {}
                for metadata in results['metadatas']:
                    doc_id = metadata['document_id']
                    if doc_id not in doc_stats:
                        doc_stats[doc_id] = {
                            "document_id": doc_id,
                            "title": metadata['title'],
                            "chunk_count": 0
                        }
                    doc_stats[doc_id]["chunk_count"] += 1
                
                return {
                    "total_documents": len(doc_stats),
                    "total_chunks": len(results['ids']),
                    "documents": list(doc_stats.values())
                }
                
        except Exception as e:
            logger.error(f"Error getting document stats: {str(e)}")
            return {}

# Global instance
vector_store = DocumentVectorStore()