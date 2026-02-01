# 🎤 AI Interview Prep Tool

Prepare for your interviews with AI-powered feedback on your responses.

## 🚀 Quick Start

```bash
# 1. Clone repo
git clone https://github.com/MwMwM-2428/Gemini-Hackathon.git
cd Gemini-Hackathon

# 2. Setup (see SETUP.md for detailed instructions)
cp .env.example .env
# Edit .env and add your Google API key

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run backend (Terminal 1)
python backend.py

# 5. Run frontend (Terminal 2)
python -m http.server 3000

# 6. Open http://localhost:3000
```

## 📋 What You Need

- Python 3.8+
- Google Gemini API key
- Modern web browser

## 🎯 Features

✅ Audio recording & playback  
✅ File upload (resume/job description)  
✅ Text input for responses  
✅ AI-powered evaluation with scoring  
✅ Detailed feedback metrics  
✅ Beautiful responsive UI  

## 🏗️ Architecture

**Backend**: Flask API (port 5002)  
**Frontend**: HTML/CSS/JavaScript (port 3000)  
**AI Model**: Google Gemini 2.5 Flash  

## 📚 Documentation

- **SETUP.md** - Complete setup guide
- **BACKEND_MONITORING.md** - Backend monitoring & troubleshooting
- **SETUP_AND_FIX_SUMMARY.md** - Technical details

## ⚙️ Configuration

Copy `.env.example` to `.env` and add:
```
GEMINI_API_KEY=your_key_here
```

**Important**: Never commit `.env` file! It's already in `.gitignore`.

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Check if backend is running |
| `/api/evaluate` | POST | Submit response for evaluation |

## 🎨 UI Colors

Morandi palette for professional, sophisticated look:
- Sage Green (#9ba89d)
- Dusty Mauve (#a89ac7)
- Soft Terracotta (#b39486)

## 🐛 Troubleshooting

**Port in use?**
```bash
lsof -ti :5002 | xargs kill -9
lsof -ti :3000 | xargs kill -9
```

**API key not working?**
- Verify key is added to `.env`
- Check API is enabled in Google Cloud

**Can't connect frontend to backend?**
```bash
curl http://localhost:5002/api/health
```

## 📦 Project Structure

```
├── backend.py           # Flask API
├── Frontend.jsx         # React component
├── index.html          # HTML interface
├── App.css             # Styling
├── requirements.txt    # Dependencies
└── .env.example        # Environment template
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📝 License

[Add your license here]

---

**For detailed setup instructions, see [SETUP.md](SETUP.md)**
