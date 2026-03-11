import React, { useState, useEffect } from 'react';
import './App.css';
import ClientIntake from './components/ClientIntake';
import LawyerDashboard from './components/LawyerDashboard';
import LegalChatbot from './components/LegalChatbot';

function App() {
  const [view, setView] = useState('client');
  const [submissions, setSubmissions] = useState([]);
  const [showChat, setShowChat] = useState(false);

  // Load submissions from localStorage on mount
  useEffect(() => {
    const savedSubmissions = localStorage.getItem('juris-case-submissions');
    if (savedSubmissions) {
      try {
        const parsed = JSON.parse(savedSubmissions);
        setSubmissions(parsed);
        console.log('✅ Loaded', parsed.length, 'cases from history');
      } catch (error) {
        console.error('Error loading submissions:', error);
      }
    }
  }, []);

  // Save submissions to localStorage whenever they change
  useEffect(() => {
    if (submissions.length > 0) {
      localStorage.setItem('juris-case-submissions', JSON.stringify(submissions));
      console.log('💾 Saved', submissions.length, 'cases to history');
    }
  }, [submissions]);

  const handleSubmission = (submission) => {
    const newSubmission = {
      ...submission,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      submittedAt: new Date().toLocaleString()
    };
    
    setSubmissions([newSubmission, ...submissions]); // Add new case at the beginning
    console.log('✅ New case added:', newSubmission.clientInfo.name);
  };

  const clearAllCases = () => {
    if (window.confirm('⚠️ Are you sure you want to delete ALL cases? This cannot be undone!')) {
      setSubmissions([]);
      localStorage.removeItem('juris-case-submissions');
      alert('🗑️ All cases have been deleted!');
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>⚖️ Juris</h1>
        <p className="tagline">Technology that speaks legal</p>
        <div className="view-toggle">
          <button 
            className={view === 'client' ? 'active' : ''}
            onClick={() => setView('client')}
          >
            Client View
          </button>
          <button 
            className={view === 'lawyer' ? 'active' : ''}
            onClick={() => setView('lawyer')}
          >
            Lawyer Dashboard
            {submissions.length > 0 && (
              <span className="case-count">{submissions.length}</span>
            )}
          </button>
        </div>
      </header>
      
      <main>
        {view === 'client' ? (
          <ClientIntake onSubmit={handleSubmission} />
        ) : (
          <LawyerDashboard 
            submissions={submissions} 
            onClearAll={clearAllCases}
          />
        )}
      </main>

      {/* Floating Chat Button */}
      <button 
        className="chat-float-btn"
        onClick={() => setShowChat(!showChat)}
        title="Ask Legal Questions"
      >
        {showChat ? '✕' : '💬'}
      </button>

      {/* Chatbot Modal */}
      {showChat && <LegalChatbot onClose={() => setShowChat(false)} />}
    </div>
  );
}

export default App;

