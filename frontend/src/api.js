const API_BASE = 'http://127.0.0.1:8000';  // Your Django backend address

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_BASE}/upload/`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

export async function askQuestion(question) {
  const response = await fetch(`${API_BASE}/ask/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  return response.json();
}

export async function testApi() {
  const response = await fetch(`${API_BASE}/test/`);
  return response.json();
}
