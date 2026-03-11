import React, { useState } from 'react';
import './LawyerDashboard.css';
import jsPDF from 'jspdf';

const LawyerDashboard = ({ submissions, onClearAll }) => {
  const [expandedCase, setExpandedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [caseStatuses, setCaseStatuses] = useState({});

  const updateStatus = (caseId, newStatus) => {
    setCaseStatuses({
      ...caseStatuses,
      [caseId]: newStatus
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f59e0b',
      'reviewing': '#3b82f6',
      'accepted': '#10b981',
      'in-progress': '#8b5cf6',
      'resolved': '#059669'
    };
    return colors[status] || '#6b7280';
  };

  const exportToPDF = (submission) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // ========== HEADER WITH GRADIENT EFFECT ==========
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo/Icon
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('⚖️', 15, 25);
    
    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('JURIS', 30, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Technology that speaks legal', 30, 27);
    
    // Case ID
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`Case ID: #${submission.id}`, pageWidth - 15, 20, { align: 'right' });
    doc.text(`Submitted: ${submission.submittedAt || new Date(submission.timestamp).toLocaleString()}`, pageWidth - 15, 27, { align: 'right' });
    
    yPos = 50;

    // ========== DOCUMENT TITLE ==========
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('LEGAL CASE REPORT', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 15;

    // ========== CLIENT INFORMATION SECTION ==========
    doc.setFillColor(240, 242, 245);
    doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('📋 CLIENT INFORMATION', 20, yPos);
    
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    
    const clientInfo = [
      { label: 'Full Name:', value: submission.clientInfo.name },
      { label: 'Email Address:', value: submission.clientInfo.email },
      { label: 'Phone Number:', value: submission.clientInfo.phone || 'Not provided' }
    ];

    clientInfo.forEach(item => {
      doc.setFont('helvetica', 'bold');
      doc.text(item.label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(item.value, 60, yPos);
      yPos += 7;
    });

    yPos += 5;

    // ========== CASE ANALYSIS SECTION ==========
    doc.setFillColor(240, 242, 245);
    doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('⚖️ CASE ANALYSIS', 20, yPos);
    
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Legal Area:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(102, 126, 234);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(60, yPos - 4, 40, 6, 2, 2, 'F');
    doc.text(submission.analysis.legalArea, 62, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Urgency Level:', 20, yPos);
    
    const urgencyColors = {
      'High': [239, 68, 68],
      'Medium': [245, 158, 11],
      'Low': [16, 185, 129]
    };
    const urgencyColor = urgencyColors[submission.analysis.urgency] || [107, 114, 128];
    doc.setFillColor(...urgencyColor);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(60, yPos - 4, 30, 6, 2, 2, 'F');
    doc.text(submission.analysis.urgency, 62, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Complexity:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(submission.analysis.estimatedComplexity, 60, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Current Status:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFillColor(59, 130, 246);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(60, yPos - 4, 35, 6, 2, 2, 'F');
    doc.text(caseStatuses[submission.id] || 'Pending', 62, yPos);
    
    yPos += 15;

    // ========== CASE DESCRIPTION SECTION ==========
    doc.setFillColor(240, 242, 245);
    doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('📝 CASE DESCRIPTION', 20, yPos);
    
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    const descLines = doc.splitTextToSize(submission.description, pageWidth - 40);
    doc.text(descLines, 20, yPos);
    yPos += descLines.length * 5 + 10;

    // ========== KEY FACTS SECTION ==========
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 242, 245);
    doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('🔍 KEY FACTS', 20, yPos);
    
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    
    submission.analysis.keyFacts.forEach((fact, index) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFillColor(102, 126, 234);
      doc.circle(22, yPos - 1.5, 1.5, 'F');
      
      const factLines = doc.splitTextToSize(fact, pageWidth - 50);
      doc.text(factLines, 27, yPos);
      yPos += factLines.length * 5 + 3;
    });

    yPos += 5;

    // ========== SUGGESTED QUESTIONS SECTION ==========
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 242, 245);
    doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(102, 126, 234);
    doc.text('❓ SUGGESTED QUESTIONS FOR CLIENT', 20, yPos);
    
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    
    submission.analysis.suggestedQuestions.forEach((question, index) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text(`Q${index + 1}.`, 20, yPos);
      doc.setFont('helvetica', 'normal');
      
      const qLines = doc.splitTextToSize(question, pageWidth - 50);
      doc.text(qLines, 27, yPos);
      yPos += qLines.length * 5 + 3;
    });

    if (submission.document) {
      yPos += 5;
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(240, 242, 245);
      doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 126, 234);
      doc.text('📎 ATTACHED DOCUMENTS', 20, yPos);
      
      yPos += 12;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 51, 51);
      doc.text(`• ${submission.document}`, 20, yPos);
    }

    // ========== FOOTER ==========
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const footerY = pageHeight - 20;
      
      doc.setDrawColor(102, 126, 234);
      doc.setLineWidth(0.5);
      doc.line(15, footerY, pageWidth - 15, footerY);
      
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'italic');
      doc.text('This document is confidential and intended solely for legal review.', pageWidth / 2, footerY + 5, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.text('Juris - Technology that speaks legal', 15, footerY + 10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, footerY + 10, { align: 'right' });
      doc.text('www.juris.app', pageWidth - 15, footerY + 15, { align: 'right' });
    }

    const fileName = `Juris_Case_${submission.clientInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const copyToClipboard = (submission) => {
    const text = `
JURIS CASE DETAILS
==================

CLIENT INFORMATION:
Name: ${submission.clientInfo.name}
Email: ${submission.clientInfo.email}
Phone: ${submission.clientInfo.phone || 'Not provided'}

CASE ANALYSIS:
Legal Area: ${submission.analysis.legalArea}
Urgency: ${submission.analysis.urgency}
Complexity: ${submission.analysis.estimatedComplexity}
Status: ${caseStatuses[submission.id] || 'Pending'}
Submitted: ${submission.submittedAt || new Date(submission.timestamp).toLocaleString()}

CASE DESCRIPTION:
${submission.description}

KEY FACTS:
${submission.analysis.keyFacts.map((fact, i) => `${i + 1}. ${fact}`).join('\n')}

SUGGESTED QUESTIONS:
${submission.analysis.suggestedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---
Generated by Juris - Technology that speaks legal
    `;
    
    navigator.clipboard.writeText(text);
    alert('✅ Case details copied to clipboard!');
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.clientInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.analysis.legalArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.clientInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUrgency = filterUrgency === 'all' || sub.analysis.urgency === filterUrgency;
    
    return matchesSearch && matchesUrgency;
  });

  const getUrgencyStats = () => {
    const stats = { High: 0, Medium: 0, Low: 0 };
    submissions.forEach(sub => {
      stats[sub.analysis.urgency]++;
    });
    return stats;
  };

  const stats = getUrgencyStats();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>📊 Lawyer Dashboard</h2>
          {submissions.length > 0 && (
            <button className="clear-all-btn" onClick={onClearAll}>
              🗑️ Clear All Cases
            </button>
          )}
        </div>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Cases</span>
            <span className="stat-value">{submissions.length}</span>
          </div>
          <div className="stat-item high">
            <span className="stat-label">High Priority</span>
            <span className="stat-value">{stats.High}</span>
          </div>
          <div className="stat-item medium">
            <span className="stat-label">Medium Priority</span>
            <span className="stat-value">{stats.Medium}</span>
          </div>
          <div className="stat-item low">
            <span className="stat-label">Low Priority</span>
            <span className="stat-value">{stats.Low}</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Search by name, email, or legal area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterUrgency} 
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Urgency Levels</option>
          <option value="High">🔴 High Priority</option>
          <option value="Medium">🟡 Medium Priority</option>
          <option value="Low">🟢 Low Priority</option>
        </select>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="no-cases">
          <p>📭 {searchTerm || filterUrgency !== 'all' ? 'No cases match your filters' : 'No case submissions yet'}</p>
        </div>
      ) : (
        <div className="cases-grid">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="case-card">
              <div className="case-header">
                <div className="case-title">
                  <h3>{submission.clientInfo.name}</h3>
                  <span className={`urgency-badge ${submission.analysis.urgency.toLowerCase()}`}>
                    {submission.analysis.urgency === 'High' && '🔴'}
                    {submission.analysis.urgency === 'Medium' && '🟡'}
                    {submission.analysis.urgency === 'Low' && '🟢'}
                    {submission.analysis.urgency}
                  </span>
                </div>
                <div className="case-meta">
                  <span className="legal-area">{submission.analysis.legalArea}</span>
                  <span className="timestamp">📅 {submission.submittedAt || new Date(submission.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="case-status-section">
                <label>Case Status:</label>
                <select 
                  value={caseStatuses[submission.id] || 'pending'}
                  onChange={(e) => updateStatus(submission.id, e.target.value)}
                  className="status-select"
                  style={{ borderColor: getStatusColor(caseStatuses[submission.id] || 'pending') }}
                >
                  <option value="pending">📋 Pending Review</option>
                  <option value="reviewing">👀 Under Review</option>
                  <option value="accepted">✅ Accepted</option>
                  <option value="in-progress">⚖️ In Progress</option>
                  <option value="resolved">🎉 Resolved</option>
                </select>
              </div>

              <div className="case-quick-info">
                <p><strong>Email:</strong> {submission.clientInfo.email}</p>
                <p><strong>Phone:</strong> {submission.clientInfo.phone || 'Not provided'}</p>
                <p><strong>Complexity:</strong> {submission.analysis.estimatedComplexity}</p>
              </div>

              <div className="case-actions">
                <button 
                  className="btn-view"
                  onClick={() => setExpandedCase(expandedCase === submission.id ? null : submission.id)}
                >
                  {expandedCase === submission.id ? '▲ Hide Details' : '▼ View Details'}
                </button>
                <button 
                  className="btn-pdf"
                  onClick={() => exportToPDF(submission)}
                  title="Export as PDF"
                >
                  📄 PDF
                </button>
                <button 
                  className="btn-copy"
                  onClick={() => copyToClipboard(submission)}
                  title="Copy to clipboard"
                >
                  📋 Copy
                </button>
              </div>

              {expandedCase === submission.id && (
                <div className="case-details">
                  <div className="detail-section">
                    <h4>Case Description</h4>
                    <p>{submission.description}</p>
                  </div>

                  <div className="detail-section">
                    <h4>Key Facts</h4>
                    <ul>
                      {submission.analysis.keyFacts.map((fact, index) => (
                        <li key={index}>{fact}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="detail-section">
                    <h4>Suggested Questions for Client</h4>
                    <ul>
                      {submission.analysis.suggestedQuestions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>

                  {submission.document && (
                    <div className="detail-section">
                      <h4>Attached Document</h4>
                      <p>📎 {submission.document}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LawyerDashboard;

