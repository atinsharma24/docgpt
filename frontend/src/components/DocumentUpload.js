import React, { useState } from 'react';
import { uploadDocument } from '../api';

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file.');

    try {
      const data = await uploadDocument(file);
      setResponse(data);
    } catch (err) {
      setResponse({ error: 'Upload failed' });
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
