# Interview Maestro 🎓

An AI-powered interview preparation platform that helps users practice for academic, social, and career interviews using Google's Gemini 2.0 Flash model.

![Home Page Hints](https://img.shields.io/badge/Status-Beta-purple) ![Monet Theme](https://img.shields.io/badge/Theme-Monet-orange)

## ✨ Features
- **Multi-Track Practice**: Academic, Social, and Career interview paths.
- **AI Feedback**: Get instant scoring and detailed metrics on tone, pacing, and clarity.
- **Real-time Live Interview**: Practice with a simulated video interview interface.
- **Monet-Inspired UI**: A beautiful, calming interface designed to reduce interview anxiety.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- **Node.js** (v16+)
- **Python** (v3.9+) or **Conda**

### 1. Installation

**Frontend Setup**
```bash
# Install Node dependencies
npm install
```

**Backend Setup**
You can use either Conda or Pip.

*Option A: Conda (Recommended)*
```bash
# Create and activate environment
conda env create -f environment.yml
conda activate Gemini
```

*Option B: Pip*
```bash
# Install requirements
pip install -r requirements.txt
```

### 2. Configuration (Crucial!)

1. Create a `.env` file in the root directory.
2. Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=AIzaSyCu0w9YOn0_9vsuRPHi5NgeZiCev8zuR4I
   ```
   *(Note: You can duplicate `.env.example` and rename it to `.env`)*

---

## ▶️ Running the App

You need two terminal windows running simultaneously.

**Terminal 1: Start Backend**
```bash
# Make sure your python environment is activated
python backend.py
```
*Backend runs on http://localhost:5002*

**Terminal 2: Start Frontend**
```bash
npm run dev
```
*Frontend runs on http://localhost:5173*

Open **http://localhost:5173** in your browser to begin!

---

## 📂 Project Structure

- **src/**: React frontend source code.
  - `App.jsx`: Main application logic and routing.
  - `App.css`: All styling (Monet theme, animations).
- **backend.py**: Flask server handling AI connectivity.
- **public/camera.html**: Standalone Live Interview module.
- **AudioTesting/** & **CamTest/**: Legacy testing modules.

## 🛠 Troubleshooting

- **Ports**: Frontend uses `5173`, Backend uses `5002`. Ensure these ports are free.
- **API Key**: If AI feedback fails, check that your `GEMINI_API_KEY` is correct in `.env`.
- **Microphone/Camera**: Allow browser permissions for recording to work.
