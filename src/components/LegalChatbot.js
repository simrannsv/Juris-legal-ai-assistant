import React, { useState } from 'react';
import './LegalChatbot .css';

const LegalChatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am your Juris Legal Assistant powered by AI. Ask me any legal question!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getLegalResponse = async (question) => {
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      return data.response;
      
    } catch (error) {
      console.error('Error:', error);
      return "I apologize, but I'm having trouble connecting to my AI service right now. Please make sure the backend server is running (npm start in backend folder), or submit your case through the Client View for direct assistance from our lawyers.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages([...messages, userMessage]);
    const question = input;
    setInput('');
    setLoading(true);
    
    const response = await getLegalResponse(question);
    const botMessage = { id: Date.now() + 1, type: 'bot', text: response };
    setMessages(prev => [...prev, botMessage]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div>
            <h3>💬 Juris Legal Assistant</h3>
            <p>AI-powered legal guidance</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="chatbot-input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask any legal question..."
            rows="2"
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalChatbot;

