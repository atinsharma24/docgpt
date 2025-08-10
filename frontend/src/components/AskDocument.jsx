import React, { useState, useEffect } from 'react';
import { askQuestion } from '../api/api';

export default function AskDocument() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [documentId, setDocumentId] = useState('');
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Fetch available documents
    fetch('/api/documents/')
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(err => console.error('Failed to fetch documents:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question) return alert('Please enter a question.');
    if (!documentId) return alert('Please select a document.');

    try {
      const data = await askQuestion(question, documentId);
      setAnswer(data);
    } catch (err) {
      setAnswer({ error: 'Question failed' });
    }
  };

  return (
    <div>
      <h2>Ask Document</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Document:</label>
          <select 
            value={documentId} 
            onChange={e => setDocumentId(e.target.value)}
            required
          >
            <option value="">Choose a document...</option>
            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Enter your question"
            required
          />
        </div>
        <button type="submit">Ask</button>
      </form>
      {answer && <pre>{JSON.stringify(answer, null, 2)}</pre>}
    </div>
  );
}
