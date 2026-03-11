const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = process.env.MODEL_NAME || 'llama3.2:3b';

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Juris Legal Chatbot API is running with Ollama!' });
});

// Check Ollama status
app.get('/api/status', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    res.json({ 
      success: true, 
      models: data.models,
      ollamaRunning: true 
    });
  } catch (error) {
    res.json({ 
      success: false, 
      ollamaRunning: false,
      error: 'Ollama is not running. Please start it with: ollama serve' 
    });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question is required' 
      });
    }

    console.log('Received question:', question);

    // System prompt for legal assistant
    const systemPrompt = `You are a professional legal assistant for Juris, a legal services platform. Your role is to:
- Provide clear, accurate legal information
- Use simple language that non-lawyers can understand
- Always remind users to consult a licensed attorney for specific legal advice
- Be helpful, professional, and concise
- Focus on practical guidance

Remember: You provide general legal information, not specific legal advice.`;

    // Call Ollama API
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `${systemPrompt}\n\nUser: ${question}\n\nAssistant:`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama');
    }

    const data = await response.json();
    const aiResponse = data.response;
    
    console.log('AI Response:', aiResponse.substring(0, 100) + '...');

    res.json({ 
      success: true, 
      response: aiResponse 
    });

  } catch (error) {
    console.error('Server Error:', error);
    
    // Check if Ollama is running
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        success: false, 
        error: 'Ollama is not running. Please start it with: ollama serve' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🤖 Using Ollama model: ${MODEL_NAME}`);
  console.log(`🔗 Ollama URL: ${OLLAMA_URL}`);
});

