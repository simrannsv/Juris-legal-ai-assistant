import emailjs from '@emailjs/browser';

// REPLACE THESE WITH YOUR ACTUAL VALUES
const PUBLIC_KEY = 'sxWhLQpmwyzMbbYum'; // From EmailJS Account page
const SERVICE_ID = 'service_u3bkrzw';
const TEMPLATE_ID = 'template_zk5pdwv';
const CLIENT_TEMPLATE_ID = 'template_pj0hc57';

// Initialize EmailJS once
emailjs.init(PUBLIC_KEY);

export const sendEmail = async (submissionData) => {
  try {
    const templateParams = {
      to_email: 'YOUR_LAWYER_EMAIL@gmail.com', // Add lawyer's email
      client_name: submissionData.clientInfo.name,
      client_email: submissionData.clientInfo.email,
      client_phone: submissionData.clientInfo.phone || 'Not provided',
      legal_area: submissionData.analysis.legalArea,
      urgency: submissionData.analysis.urgency,
      complexity: submissionData.analysis.estimatedComplexity,
      case_description: submissionData.description,
      key_facts: submissionData.analysis.keyFacts.join('\n'),
      has_document: submissionData.document ? 'Yes' : 'No',
      document_name: submissionData.document || 'None',
      suggested_questions: submissionData.analysis.suggestedQuestions.join('\n'),
      submission_date: new Date().toLocaleString()
    };
    
    console.log('Sending email with params:', templateParams);
    
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ Email sent successfully:', response);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.text };
  }
};

export const sendClientConfirmation = async (clientInfo) => {
  try {
    const templateParams = {
      to_email: clientInfo.email,
      client_name: clientInfo.name,
      client_email: clientInfo.email
    };
    
    const response = await emailjs.send(
      SERVICE_ID,
      CLIENT_TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ Confirmation sent:', response);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Confirmation error:', error);
    return { success: false };
  }


  
};