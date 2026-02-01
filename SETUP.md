# 🎬 Quick Start Guide - AI Interview Prep Tool

## ⚡ 5-Minute Setup for Team Members

### Step 1: Clone Repository
```bash
git clone https://github.com/MwMwM-2428/Gemini-Hackathon.git
cd Gemini-Hackathon
```

### Step 2: Get API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create new API key
3. Copy the key

### Step 3: Create .env File
```bash
cp .env.example .env
```

Edit `.env` and replace `your_api_key_here` with your actual API key.

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

Or if using conda:
```bash
conda env create -f environment.yml
conda activate Gemini
```

### Step 5: Start Backend (Terminal 1)
```bash
source .env  # Load environment variables
python backend.py
```

You should see: `Running on http://127.0.0.1:5002`

### Step 6: Start Frontend (Terminal 2)
```bash
python -m http.server 3000
```

### Step 7: Open in Browser
```
http://localhost:3000
```

---

## ✅ Testing Checklist

- [ ] Backend is running (`curl http://localhost:5002/api/health`)
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Can select interview goal
- [ ] Can record audio or type text
- [ ] Can submit and see results

---

## 📁 Project Structure

```
.
├── backend.py              # Flask API
├── Frontend.jsx            # React component
├── Frontend.js             # JavaScript version
├── index.html              # HTML interface
├── App.css                 # Styling
├── .env.example            # Environment template
├── requirements.txt        # Python dependencies
└── environment.yml         # Conda environment
```

---

## 🔑 Important: API Keys

**NEVER commit your `.env` file or API keys to GitHub!**

- ✅ Copy `.env.example` to `.env`
- ✅ Add `.env` to `.gitignore`
- ✅ Keep API key private

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Make sure API key is set
echo $GEMINI_API_KEY

# Make sure port is free
lsof -i :5002
```

### Port already in use
```bash
# Kill process on port 5002
lsof -ti :5002 | xargs kill -9

# Kill process on port 3000
lsof -ti :3000 | xargs kill -9
```

### Can't connect frontend to backend
```bash
# Check backend is running
curl http://localhost:5002/api/health

# Should return JSON with status
```

---

## 📚 Documentation

- **SETUP_AND_FIX_SUMMARY.md** - What was fixed
- **BACKEND_MONITORING.md** - Monitoring guide
- **START_HERE.md** - Detailed setup

---

## 🎯 API Endpoints

### Health Check
```bash
GET http://localhost:5002/api/health
```

### Evaluate Interview
```bash
POST http://localhost:5002/api/evaluate
Content-Type: multipart/form-data

Parameters:
- goal: "university" | "club" | "job_tech"
- text_input: User response
- context_text: Interview context
- file: Resume (optional)
- audio_response: Audio recording (optional)
```

---

## 🎨 Features

✅ Audio recording  
✅ File upload  
✅ AI evaluation with scoring  
✅ Detailed feedback metrics  
✅ Beautiful Morandi UI  
✅ Mobile responsive  

---

## 💬 Need Help?

Check the documentation files:
- API issues → `BACKEND_MONITORING.md`
- Setup issues → `SETUP_AND_FIX_SUMMARY.md`
- General → `START_HERE.md`

---

**Ready to build! 🚀**
