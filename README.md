# ⚖️ Juris — Legal AI Assistant

> **Technology that speaks legal.**

Juris is an AI-powered legal services platform that bridges the gap between clients and lawyers. Clients can submit legal issues for AI-driven analysis, while lawyers get a full-featured dashboard to manage cases — all with an intelligent chatbot available on demand.

---

## ✨ Features

### 🧑‍💼 Client Intake
- Submit legal issues with detailed descriptions and document uploads
- **AI-powered case analysis** — automatically detects legal area (Contract, Family, Criminal, Employment, Property, Personal Injury), urgency level, key facts, and case complexity
- Email notifications to both the legal team and the client via **EmailJS**

### 📊 Lawyer Dashboard
- View and manage all submitted cases with status tracking
- Filter and sort cases by urgency, legal area, and date
- Update case status (Pending → Under Review → In Progress → Resolved)
- **Export cases to PDF** with professionally formatted reports via **jsPDF**
- Copy case details to clipboard for quick sharing
- Urgency statistics and case count overview

### 💬 Legal Chatbot
- Floating chat widget accessible from any view
- Powered by **Ollama** running **Llama 3.2** locally — fully private, no data leaves your machine
- Context-aware legal guidance with professional system prompts
- Typing indicators and real-time responses

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vanilla CSS             |
| Backend    | Node.js, Express                  |
| AI Engine  | Ollama (Llama 3.2:3b)             |
| Email      | EmailJS                           |
| PDF Export | jsPDF                             |
| Storage    | LocalStorage (client-side)        |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **Ollama** — [Install Ollama](https://ollama.ai) and pull the model:
  ```bash
  ollama pull llama3.2:3b
  ```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/simrannsv/Juris-legal-ai-assistant.git
   cd Juris-legal-ai-assistant
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**

   Create a `backend/.env` file:
   ```env
   PORT=3001
   OLLAMA_URL=http://localhost:11434
   MODEL_NAME=llama3.2:3b
   ```

### Running the App

1. **Start Ollama** (in a separate terminal):
   ```bash
   ollama serve
   ```

2. **Start the backend** (from `backend/`):
   ```bash
   npm start
   ```

3. **Start the frontend** (from project root):
   ```bash
   npm start
   ```

The app runs at **http://localhost:3000** with the API at **http://localhost:3001**.

---

## 📁 Project Structure

```
Juris/
├── public/
│   └── index.html
├── src/
│   ├── App.js                  # Main app with routing & state
│   ├── App.css                 # Global styles
│   ├── components/
│   │   ├── ClientIntake.js     # Client submission form + AI analysis
│   │   ├── LawyerDashboard.js  # Case management + PDF export
│   │   └── LegalChatbot.js     # AI chat widget
│   └── services/
│       └── emailService.js     # EmailJS integration
├── backend/
│   ├── server.js               # Express API + Ollama integration
│   └── package.json
├── .gitignore
└── package.json
```

---

## 📝 API Endpoints

| Method | Endpoint       | Description                    |
|--------|----------------|--------------------------------|
| GET    | `/`            | Health check                   |
| GET    | `/api/status`  | Check Ollama connection status |
| POST   | `/api/chat`    | Send a legal question to the AI|

### Example Request

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What are my rights as a tenant?"}'
```

---



