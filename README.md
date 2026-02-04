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

### 5️⃣ Access the Frontend
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
├── SETUP.md                   # Team setup guide
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


How It Works

Backend: Flask API running on port 5002
Frontend: Web interface on port 3000
AI: Google Gemini model evaluates your responses
Storage: Everything runs locally, no database


Project Files

backend.py              Main Flask server
index.html              The web interface you interact with
App.css                 Styling for the interface
Frontend.jsx            React component version
Frontend.js             JavaScript component version
requirements.txt        Python libraries needed
environment.yml         Conda environment setup
.env.example           Template for your configuration


Configuration

Copy the example environment file:
   cp .env.example .env

Edit .env and add your actual API key:
   GEMINI_API_KEY=your_api_key_goes_here
   FLASK_ENV=development
   BACKEND_PORT=5002
   FRONTEND_PORT=3000

Important: The .env file is in .gitignore so it will never be committed to GitHub.


API Endpoints

GET /api/health
   Used to check if the backend is running
   Returns: {"status": "Backend is running!", "port": 5002}

POST /api/evaluate
   Sends your response for evaluation
   Accepts: goal, text_input, context_text, file (optional), audio_response (optional)
   Returns: score, evaluation text, and detailed metrics


Common Problems and Fixes

Port 5002 already in use
   lsof -ti :5002 | xargs kill -9

Port 3000 already in use
   lsof -ti :3000 | xargs kill -9

Backend not responding
   curl http://localhost:5002/api/health
   Should return JSON if it's working

API key not valid
   Make sure your .env file has the correct key
   Restart the backend after updating it
   Check that the key is still active in Google Cloud

Backend takes a long time to start
   Normal on first run. Just wait or restart.

Can't record audio
   Check your browser permissions
   Try a different browser if issues continue


Checking the Backend

See if it's running:
   ps aux | grep "python backend.py"

Check if port is listening:
   lsof -i :5002

Test the health endpoint:
   curl http://localhost:5002/api/health

Kill the process:
   ps aux | grep "python backend.py" | awk '{print $2}' | xargs kill


Setup for Team Members

Here's what each person needs to do:

1. Clone the repository
   git clone https://github.com/MwMwM-2428/Gemini-Hackathon.git
   cd Gemini-Hackathon

2. Get your own API key
   Free from https://aistudio.google.com/app/apikey

3. Create your environment file
   cp .env.example .env
   Add your API key to .env

4. Install dependencies
   pip install -r requirements.txt

5. Run the backend
   source .env
   python backend.py

6. Run the frontend (new terminal)
   python -m http.server 3000

7. Open http://localhost:3000

Important reminders:
   Each person must use their own API key
   Never commit the .env file to GitHub
   Keep your API key private - don't share it in Slack or email


Additional Documentation

For monitoring the backend: See BACKEND_MONITORING.md
For extended setup instructions: See SETUP.md
For technical implementation details: See SETUP_AND_FIX_SUMMARY.md


License

Add license information here
