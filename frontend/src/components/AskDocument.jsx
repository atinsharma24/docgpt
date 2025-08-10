import React, { useState, useEffect } from 'react';
import '../DocGPT.css';

export default function AskDocument() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [documentId, setDocumentId] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useSemanticSearch, setUseSemanticSearch] = useState(true);
  const [error, setError] = useState('');
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  useEffect(() => {
    // Fetch available documents
    setIsLoadingDocuments(true);
    fetch('/api/documents/')
      .then(res => res.json())
      .then(data => {
        setDocuments(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(err => {
        console.error('Failed to fetch documents:', err);
        setError('Failed to load documents. Please try refreshing the page.');
        setDocuments([]);
      })
      .finally(() => setIsLoadingDocuments(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }
    
    if (!documentId) {
      setError('Please select a document.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer(null);

    try {
      const requestData = {
        question: question.trim(),
        document_id: parseInt(documentId),
        use_semantic_search: useSemanticSearch
      };
      
      const response = await fetch('/api/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAnswer(data);
      } else {
        setError(data.error || 'Failed to get answer');
      }
    } catch (err) {
      console.error('Question error:', err);
      setError('An error occurred while processing your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDocument = documents.find(doc => doc.id === parseInt(documentId));

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">🤖</span>
        <h2 className="card-title">Ask Document</h2>
      </div>
      
      {error && (
        <div className="message message-error">
          ❌ {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Document:</label>
          {isLoadingDocuments ? (
            <div className="flex flex-center gap-2" style={{padding: '1rem'}}>
              <span className="loading-spinner"></span>
              <span>Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="message message-warning">
              ⚠️ No documents available. Please upload a document first.
            </div>
          ) : (
            <select 
              className="form-select"
              value={documentId} 
              onChange={e => setDocumentId(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">Choose a document...</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.title} (ID: {doc.id})
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">Your Question:</label>
          <textarea
            className="form-input"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question about the selected document..."
            rows={3}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label className="flex gap-2" style={{alignItems: 'center', cursor: 'pointer'}}>
            <input
              type="checkbox"
              checked={useSemanticSearch}
              onChange={e => setUseSemanticSearch(e.target.checked)}
              disabled={isLoading}
            />
            <span>Use semantic search (recommended for better accuracy)</span>
          </label>
        </div>
        
        <div className="form-group">
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={!documentId || !question.trim() || isLoading || documents.length === 0}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Processing question...
              </>
            ) : (
              <>
                <span>🤔</span>
                Ask Question
              </>
            )}
          </button>
        </div>
      </form>
      
      {answer && (
        <div className="answer-container">
          <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>📝 Answer:</h3>
          <div className="answer-text">{answer.answer}</div>
          
          <div className="answer-meta">
            <div className="flex gap-2" style={{flexWrap: 'wrap', alignItems: 'center'}}>
              <span><strong>Document:</strong> {answer.document?.title}</span>
              <span><strong>Processing time:</strong> {answer.processing_time}s</span>
              {answer.semantic_search_used && (
                <span className="message-success" style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}>
                  🔍 Semantic search used
                </span>
              )}
            </div>
          </div>
          
          {answer.sources && answer.sources.length > 0 && (
            <div className="sources-container">
              <h4 style={{marginBottom: '0.5rem', color: '#2c3e50'}}>📚 Sources:</h4>
              {answer.sources.map((source, index) => (
                <div key={index} className="source-item">
                  <div className="flex gap-2" style={{alignItems: 'center', marginBottom: '0.5rem'}}>
                    <span className="source-similarity">Similarity: {(source.similarity * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{fontSize: '0.9rem', color: '#6c757d'}}>
                    {source.text_preview}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {selectedDocument && (
        <div className="mt-3">
          <h4>📄 Selected Document Info:</h4>
          <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '6px', marginTop: '0.5rem'}}>
            <div><strong>Title:</strong> {selectedDocument.title}</div>
            <div><strong>Uploaded:</strong> {new Date(selectedDocument.uploaded_at).toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
