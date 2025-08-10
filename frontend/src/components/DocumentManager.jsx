import React, { useState, useEffect } from 'react';
import '../DocGPT.css';

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents/');
      const data = await response.json();
      setDocuments(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents');
      setDocuments([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (documentId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(documentId);
    try {
      const response = await fetch(`/api/delete/${documentId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        // Refresh stats
        await fetchStats();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('An error occurred while deleting the document');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex flex-center gap-2" style={{padding: '2rem'}}>
          <span className="loading-spinner"></span>
          <span>Loading document manager...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">📁</span>
        <h2 className="card-title">Document Manager</h2>
      </div>

      {error && (
        <div className="message message-error">
          ❌ {error}
        </div>
      )}

      {/* Statistics Section */}
      {stats && (
        <div className="stats-container">
          <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>📊 Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.total_documents || 0}</div>
              <div className="stat-label">Total Documents</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.total_chunks || 0}</div>
              <div className="stat-label">Text Chunks</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {stats.total_documents > 0 ? Math.round(stats.total_chunks / stats.total_documents) : 0}
              </div>
              <div className="stat-label">Avg Chunks/Doc</div>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="documents-section">
        <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>
          📄 Documents ({documents.length})
        </h3>
        
        {documents.length === 0 ? (
          <div className="message message-info">
            ℹ️ No documents uploaded yet. Upload your first document to get started!
          </div>
        ) : (
          <div className="document-list">
            {documents.map(doc => (
              <div key={doc.id} className="document-item">
                <div className="document-info">
                  <div className="document-title">
                    <span className="document-icon">📄</span>
                    <span>{doc.title}</span>
                  </div>
                  <div className="document-meta">
                    <span>ID: {doc.id}</span>
                    <span>•</span>
                    <span>Uploaded: {formatDate(doc.uploaded_at)}</span>
                    {doc.file && (
                      <>
                        <span>•</span>
                        <span>Size: {formatFileSize(doc.file.size || 0)}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="document-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(doc.id, doc.title)}
                    disabled={deletingId === doc.id}
                  >
                    {deletingId === doc.id ? (
                      <>
                        <span className="loading-spinner"></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vector Store Information */}
      {stats && stats.documents && stats.documents.length > 0 && (
        <div className="vector-store-section">
          <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>🔍 Vector Store Details</h3>
          <div className="vector-store-list">
            {stats.documents.map(doc => (
              <div key={doc.document_id} className="vector-store-item">
                <div className="flex gap-2" style={{alignItems: 'center'}}>
                  <span className="document-icon">📄</span>
                  <span><strong>{doc.title}</strong></span>
                  <span className="chunk-count">{doc.chunk_count} chunks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-3">
        <h4>💡 Tips:</h4>
        <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem', color: '#6c757d'}}>
          <li>Documents are automatically processed for semantic search</li>
          <li>Text chunks enable more precise question answering</li>
          <li>Deleting a document removes it from both database and vector store</li>
          <li>Upload new documents using the Upload tab</li>
        </ul>
      </div>
    </div>
  );
}
