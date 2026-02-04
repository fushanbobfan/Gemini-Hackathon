# AI Interview Prep Tool

## Quick Start

### 1. Clone
```bash
git clone https://github.com/MwMwM-2428/Gemini-Hackathon.git
cd Gemini-Hackathon
```

### 2. Get API Key
Go to https://aistudio.google.com/app/apikey → Create API key (free)

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Backend (Terminal 1)
```bash
export GEMINI_API_KEY="your-api-key-here"
python backend.py
```
You should see: `Running on http://127.0.0.1:5002`

### 5. Run Frontend (Terminal 2 - open a new terminal)
```bash
cd Gemini-Hackathon
python -m http.server 3000
```
You should see: `Serving HTTP on :: port 3000`

### 6. Open Browser
Go to: **http://localhost:3000/index.html**

---

## What It Does
- Record audio answers to interview questions
- Upload resume/job description for context
- Get AI-powered feedback with score and metrics

## Requirements
- Python 3.8+
- Google Gemini API key (free)

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check if backend is running |
| `/api/evaluate` | POST | Submit response for evaluation |

## Troubleshooting

**Port already in use:**
```bash
lsof -ti :5002 | xargs kill -9
lsof -ti :3000 | xargs kill -9
```

**API key not set:**
```bash
echo $GEMINI_API_KEY
# If empty, set it again
export GEMINI_API_KEY="your-key"
```

**Check if backend is running:**
```bash
curl http://localhost:5002/api/health
```

---

**Status**: Production Ready ✅
