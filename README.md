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

### 4. Run Backend
```bash
export GEMINI_API_KEY="your-api-key-here"
python backend.py
```

### 5. Run Frontend (new terminal)
```bash
python -m http.server 3000
```

### 6. Open Browser
http://localhost:3000

---

## What It Does
- Record audio answers to interview questions
- Upload resume/job description for context
- Get AI-powered feedback with score and metrics

## Requirements
- Python 3.8+
- Conda environment "Gemini"
- Google Gemini API key (free)

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check if backend is running |
| `/api/evaluate` | POST | Submit response for evaluation |

## Troubleshooting

**Port already in use:**
```bash
lsof -ti :5001 | xargs kill -9
```

**API key not set:**
```bash
echo $GEMINI_API_KEY
# If empty, set it again
export GEMINI_API_KEY="your-key"
```

**Check if backend is running:**
```bash
curl http://localhost:5001/api/health
```

---

**Status**: Production Ready ✅
