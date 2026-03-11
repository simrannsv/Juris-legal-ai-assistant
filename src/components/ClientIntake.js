import React, { useState } from 'react';
import { sendEmail, sendClientConfirmation } from '../services/emailService';
import './ClientIntake.css';

const ClientIntake = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    document: null
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file.name });
    }
  };

  const analyzeCase = (data) => {
    const text = data.description.toLowerCase();
    
    let legalArea = 'General';
    if (text.includes('contract') || text.includes('agreement')) legalArea = 'Contract Law';
    else if (text.includes('divorce') || text.includes('custody') || text.includes('marriage')) legalArea = 'Family Law';
    else if (text.includes('accident') || text.includes('injury') || text.includes('negligence')) legalArea = 'Personal Injury';
    else if (text.includes('property') || text.includes('real estate') || text.includes('landlord')) legalArea = 'Property Law';
    else if (text.includes('criminal') || text.includes('arrest') || text.includes('charge')) legalArea = 'Criminal Law';
    else if (text.includes('employee') || text.includes('fired') || text.includes('workplace')) legalArea = 'Employment Law';
    
    let urgency = 'Medium';
    if (text.includes('urgent') || text.includes('immediately') || text.includes('asap') || text.includes('deadline')) urgency = 'High';
    else if (text.includes('consultation') || text.includes('advice') || text.includes('question')) urgency = 'Low';
    
    const sentences = data.description.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyFacts = sentences.slice(0, 3).map(s => s.trim());
    
    const questions = [
      'What is the timeline of events?',
      'Do you have any written documentation?',
      'Have you consulted with anyone else about this matter?',
      'What outcome are you seeking?'
    ];
    
    return {
      legalArea,
      urgency,
      keyFacts,
      suggestedQuestions: questions,
      hasDocument: !!data.document,
      estimatedComplexity: keyFacts.length > 2 ? 'Complex' : 'Standard'
    };
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setAnalyzing(true);
  
  setTimeout(async () => {
    const analysis = analyzeCase(formData);
    const submissionData = {
      clientInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      },
      description: formData.description,
      document: formData.document,
      analysis
    };
    
    onSubmit(submissionData);
    
    // Send emails
    try {
      await sendEmail(submissionData);
      await sendClientConfirmation(formData);
    } catch (error) {
      console.error('Email sending failed:', error);
    }
    
    setAnalyzing(false);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', description: '', document: null });
    }, 3000);
  }, 2000);
};

  return (
    <div className="client-intake">
      <div className="intake-header">
        <h2>Submit Your Legal Issue</h2>
        <p>Describe your situation or upload documents. Our AI will analyze and prepare a brief for our lawyers.</p>
      </div>

      <form onSubmit={handleSubmit} className="intake-form">
        <div className="form-section">
          <h3>Your Information</h3>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="john@example.com"
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Your Legal Issue</h3>
          <div className="form-group">
            <label>Describe Your Situation *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="8"
              placeholder="Please describe your legal issue in detail. Include relevant dates, parties involved, and what outcome you're seeking..."
            />
            <small>{formData.description.length} characters</small>
          </div>
          
          <div className="form-group">
            <label>Upload Documents (Optional)</label>
            <div className="file-upload">
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file-input" className="file-label">
                <span className="upload-icon">📎</span>
                {formData.document || 'Choose file (PDF, DOC, TXT)'}
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={analyzing}>
          {analyzing ? (
            <>
              <span className="spinner"></span>
              Analyzing with AI...
            </>
          ) : (
            'Submit for Review'
          )}
        </button>
      </form>
    </div>
  );
};

export default ClientIntake;
