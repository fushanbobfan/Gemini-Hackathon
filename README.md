# AI Interview Prep Tool

## Setup & Run

### 1. Clone Repository
```bash
git clone https://github.com/MwMwM-2428/Gemini-Hackathon.git
cd Gemini-Hackathon
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
npm install
```

### 3. Get Gemini API Key
Visit: https://aistudio.google.com/app/apikey and create a new API key (free)

### 4. Terminal 1 - Start Backend
```bash
export GEMINI_API_KEY="your-api-key-here"
python backend.py
```
Backend runs on: `http://localhost:5002`

### 5. Terminal 2 - Start Frontend
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173` (check console output for exact port)

### 6. Open in Browser
Navigate to the URL shown in Terminal 2 (typically http://localhost:5173)

---

## How to Use
1. Select an interview goal from the dropdown
2. Record audio or type your response
3. Optionally upload resume/job description for context
4. Click "✨ Get Evaluation"
5. View your score and AI feedback

## Tech Stack
- **Backend**: Python Flask + Google Gemini 2.5 Flash API
- **Frontend**: React 18 + Vite
- **Requirements**: Python 3.8+, Node.js 16+
- Node.js 16+ and npm
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
lsof -ti :5173 | xargs kill -9
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

**Frontend not loading:**
- Make sure `npm install` completed successfully
- Check that `npm run dev` is running on port 5173
- Clear browser cache (Ctrl+Shift+Delete)

---

**Status**: Production Ready ✅
