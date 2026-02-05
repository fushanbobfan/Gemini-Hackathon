# 🚀 Team Setup Guide - Gemini Hackathon (Interview Evaluation System)

Complete setup instructions for team members to get the interview evaluation system running locally.

---

## ⚡ Quick Start (5 minutes)

### 1️⃣ Clone & Navigate
```bash
git clone https://github.com/MwMwM-2428/Gemini-Hackathon.git
cd Gemini-Hackathon
```

### 2️⃣ Set API Key
```bash
export GEMINI_API_KEY="your-api-key-here"
```
*Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)*

### 3️⃣ Install Dependencies
```bash
pip install -r requirements.txt
# OR if using conda
conda env create -f environment.yml
conda activate Gemini
```

### 4️⃣ Start Backend (in one terminal)
```bash
python backend.py
```

**Expected output:**
```
Backend running on http://127.0.0.1:5002
Press Ctrl+C to stop
```

### 5️⃣ Access the Frontend - The files in src folder are run 
- Open your browser and go to the **frontend directory** (React/Vue/HTML based on your implementation)
- Or check `localhost:3000` if using a development server
- Backend API will be available at `http://localhost:5002/api/evaluate`

---

## 📋 Full Setup with All Services

### Terminal 1: Start Backend
```bash
cd Gemini-Hackathon
export GEMINI_API_KEY="your-api-key-here"
python backend.py
```

### Terminal 2: Start Frontend (if separate dev server needed)
```bash
# If using React/Vue/Next.js
cd Gemini-Hackathon/frontend
npm install
npm start
# or
npm run dev
```

### Terminal 3: Optional - Audio Testing Service
```bash
cd Gemini-Hackathon/AudioTesting
python -m http.server 8000
```

---

## 🔑 Environment Setup

### Set API Key (Choose One)

**Option A: Temporary (Current Session)**
```bash
export GEMINI_API_KEY="your-api-key-here"
```

**Option B: Permanent (Add to ~/.zshrc or ~/.bash_profile)**
```bash
echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc
```

**Option C: Inline (Single Command)**
```bash
GEMINI_API_KEY="your-api-key-here" python backend.py
```

---

## ✅ Verify Setup

### Check Backend is Running
```bash
curl http://localhost:5002/api/health
```

**Expected response:**
```json
{
  "status": "Backend is running!",
  "port": 5002
}
```

### Check Frontend is Running
```bash
curl http://localhost:8001/psychTEST.html | head -20
```

### Check Python Environment
```bash
python --version
pip list | grep -i requests
```

---

## 📁 Project Structure

```
Gemini-Hackathon/
├── backend.py                 # Main backend server
├── environment.yml            # Conda environment config
├── requirements.txt           # Python dependencies
├── Frontend.js                # Frontend logic
├── README.md                  # Project overview
├── SETUP.md                   # This file
├── BACKEND_MONITORING.md      # Backend monitoring guide
│
├── CamTest/
│   ├── app.py
│   ├── camera.html
│   └── README.md
│
├── AudioTesting/
│   └── audio_testing.html
│
└── frontend/
    └── (React/Vue files)

Documents/
├── psychTEST.html             # Main exam interface
├── psychTEST_data.json        # 141 psychology questions
└── (Other test files)
```

---

## 🛠️ Common Commands

### Stop All Services
```bash
# Stop backend
pkill -f "python backend.py"

# Stop frontend
pkill -f "http.server"

# Stop by port
lsof -ti :5002 | xargs kill -9
lsof -ti :8001 | xargs kill -9
```

### Check Running Services
```bash
ps aux | grep -E "backend|http.server"
lsof -i :5002
lsof -i :8001
```

### View Backend Logs
```bash
# Keep backend running and watch output
cd Gemini-Hackathon
export GEMINI_API_KEY="your-api-key-here"
python backend.py 2>&1 | tee backend.log
```

---

## 🔧 Troubleshooting

### Error: "Address already in use"
```bash
# Find and kill process using port
lsof -ti :5002 | xargs kill -9
lsof -ti :8001 | xargs kill -9

# Then restart services
```

### Error: "GEMINI_API_KEY not found"
```bash
# Verify API key is set
echo $GEMINI_API_KEY

# If empty, set it
export GEMINI_API_KEY="your-api-key-here"
```

### Error: "ModuleNotFoundError"
```bash
# Install dependencies
pip install -r requirements.txt

# Or create conda environment
conda env create -f environment.yml
conda activate Gemini
```

### Backend not responding
```bash
# Check if running
curl http://localhost:5002/api/health

# If fails, restart backend with API key
cd /Users/alinaliu18/Gemini-Hackathon && \
export GEMINI_API_KEY="your-api-key-here" && \
python backend.py
```

---

## 🎯 Quick Reference Card

| Service | Port | Command | URL |
|---------|------|---------|-----|
| Backend | 5002 | `cd Gemini-Hackathon && export GEMINI_API_KEY="..." && python backend.py` | http://localhost:5002/api/health |
| Frontend | 8001 | `cd path/to/psychTEST/files && python3 -m http.server 8001` | http://localhost:8001/psychTEST.html |
| Audio Test | 8000 | `cd Gemini-Hackathon/AudioTesting && python -m http.server 8000` | http://localhost:8000 |

---

## 📚 Additional Resources

- **Backend Monitoring**: See [BACKEND_MONITORING.md](BACKEND_MONITORING.md)
- **API Documentation**: Backend endpoints in BACKEND_MONITORING.md
- **Google Gemini API**: https://ai.google.dev
- **Environment Setup**: Check `environment.yml` and `requirements.txt`

---

## ❓ Need Help?

1. Check **BACKEND_MONITORING.md** for backend issues
2. Verify all ports are available (5002, 8001, 8000)
3. Ensure GEMINI_API_KEY is properly set
4. Check Python version: `python --version` (3.8+)
5. Review error logs carefully

---

**Last Updated**: February 3, 2026
**Status**: Production Ready ✅
