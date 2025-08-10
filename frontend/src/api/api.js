const API_BASE = 'http://127.0.0.1:8000';  // Your Django backend address

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_BASE}/api/upload/`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function askQuestion(question, documentId) {
  const response = await fetch(`${API_BASE}/api/ask/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, document_id: documentId }),
  });
  return response.json();
}

export async function testApi() {
  const response = await fetch(`${API_BASE}/api/test/`);
  return response.json();
}

export async function getDocuments() {
  const response = await fetch(`${API_BASE}/api/documents/`);
  return response.json();
}
