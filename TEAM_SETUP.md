# Team Setup Guide - React Frontend

## Step 1: Clone Repository
```bash
git clone https://github.com/MwMwM-2428/Gemini-Hackathon.git
cd Gemini-Hackathon
```

## Step 2: Install Dependencies

**Python dependencies:**
```bash
pip install -r requirements.txt
```

**Node.js dependencies:**
```bash
npm install
```

## Step 3: Get Gemini API Key
Visit https://aistudio.google.com/app/apikey and create a free API key.

Copy the key - you'll need it in the next step.

## Step 4: Start Backend (Terminal 1)
```bash
cd /Users/alinaliu18/Gemini-Hackathon
export GEMINI_API_KEY="YOUR-API-KEY-HERE"
python backend.py
```

**You should see:**
```
 * Running on http://127.0.0.1:5002
```

## Step 5: Start Frontend (Terminal 2 - open a new terminal)
```bash
cd /Users/alinaliu18/Gemini-Hackathon
npm run dev
```

**You should see:**
```
  ➜  Local:   http://localhost:5173/
```

## Step 6: Open Browser
Copy the URL from Step 5 (usually `http://localhost:5173`) and open it in your browser.

## How to Use
1. **Select interview goal** from the dropdown menu
2. **Provide response:** Either:
   - Record audio by clicking the microphone button
   - Type your text response
3. **Optional:** Upload your resume or job description for context
4. **Click "✨ Get Evaluation"** to submit
5. **View results:** See your score, feedback, and performance metrics

## Troubleshooting

**Backend not responding?**
```bash
curl http://localhost:5002/api/health
```
You should see: `{"port":5002,"status":"Backend is running!"}`

**Frontend port different?**
Vite will auto-increment the port if 5173 is busy. Check the terminal output for the actual URL.

**Need to restart everything?**
```bash
pkill -f "python backend.py"
pkill -f "npm run dev"
# Then re-run Step 4 and Step 5
```
