import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import DocumentUpload from './components/DocumentUpload';
import AskDocument from './components/AskDocument';
import DocumentManager from './components/DocumentManager';
import TestView from './components/TestView';
import './App.css';
import './DocGPT.css';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    return location.pathname === path;
  };
  
  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <span className="brand-icon">🤖</span>
        <h1 className="brand-title">DocGPT Assistant</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/upload" 
            className={`nav-link ${isActive('/upload') ? 'active' : ''}`}
          >
            <span>📤</span>
            Upload
          </Link>
        </li>
        <li>
          <Link 
            to="/ask" 
            className={`nav-link ${isActive('/ask') ? 'active' : ''}`}
          >
            <span>💬</span>
            Ask
          </Link>
        </li>
        <li>
          <Link 
            to="/manage" 
            className={`nav-link ${isActive('/manage') ? 'active' : ''}`}
          >
            <span>📁</span>
            Manage
          </Link>
        </li>
        <li>
          <Link 
            to="/test" 
            className={`nav-link ${isActive('/test') ? 'active' : ''}`}
          >
            <span>🔧</span>
            Test
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/upload" element={<DocumentUpload />} />
            <Route path="/ask" element={<AskDocument />} />
            <Route path="/manage" element={<DocumentManager />} />
            <Route path="/test" element={<TestView />} />
            <Route path="/" element={<DocumentUpload />} />
          </Routes>
        </main>
        <footer className="main-footer">
          <p>🚀 DocGPT Assistant - AI-Powered Document Question Answering</p>
          <p>Built by <strong>Atin Sharma</strong></p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
