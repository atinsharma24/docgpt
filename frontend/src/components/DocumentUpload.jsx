import React, { useState } from "react";
import '../DocGPT.css';

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('');
    setMessageType('');
    
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setMessage('Only PDF files are supported');
        setMessageType('error');
        setFile(null);
        return;
      }
      
      // Validate file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage('File size must be less than 10MB');
        setMessageType('error');
        setFile(null);
        return;
      }
      
      setMessage(`Selected: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`);
      setMessageType('info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a PDF file to upload.');
      setMessageType('error');
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch('/api/upload/', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(`✅ Upload successful! Document "${data.document.title}" has been processed and is ready for questions.`);
        setMessageType('success');
        setFile(null);
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        // Show additional info if vector store was successful
        if (data.vector_store_added) {
          setTimeout(() => {
            setMessage(prev => prev + ' Semantic search is now available for this document.');
          }, 1000);
        }
      } else {
        setMessage(`❌ Upload failed: ${data.error || 'Unknown error'}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('❌ An error occurred during upload. Please try again.');
      setMessageType('error');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">📄</span>
        <h2 className="card-title">Upload Document</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select PDF Document</label>
          <div className="file-input-container">
            <input
              type="file"
              className="file-input"
              onChange={handleFileChange}
              accept=".pdf"
              disabled={isUploading}
            />
            <div className={`file-input-label ${file ? 'has-file' : ''}`}>
              {file ? (
                <>
                  <span>📄</span>
                  <span>{file.name}</span>
                </>
              ) : (
                <>
                  <span>📁</span>
                  <span>Click to select PDF file or drag & drop</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <span>⬆️</span>
                Upload & Process
              </>
            )}
          </button>
        </div>
      </form>
      
      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}
      
      <div className="mt-3">
        <h4>📋 Upload Guidelines:</h4>
        <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem', color: '#6c757d'}}>
          <li>Only PDF files are supported</li>
          <li>Maximum file size: 10MB</li>
          <li>Documents will be processed for AI-powered question answering</li>
          <li>Semantic search will be enabled automatically</li>
        </ul>
      </div>
    </div>
  );
}

