README - AI Interview Prep Tool

Getting Started

1. Clone repository
   git clone https://github.com/MwMwM-2428/Gemini-Hackathon.git
   cd Gemini-Hackathon

2. Get your API key
   Go to: https://aistudio.google.com/app/apikey
   Click "Create API key" (free, takes 30 seconds)

3. Setup the project
   cp .env.example .env
   Edit .env and paste your API key
   pip install -r requirements.txt

4. Start the backend (open Terminal 1)
   source .env
   python backend.py
   
   You should see: "Running on http://127.0.0.1:5002"

5. Start the frontend (open Terminal 2)
   python -m http.server 3000
   
   You should see: "Serving HTTP on 0.0.0.0 port 3000"

6. Open in your browser
   http://localhost:3000
   
   Ready to use


What This Does

- Record audio answers to interview questions
- Upload your resume or job description as context
- Type written responses if you prefer
- Get AI-powered feedback with a score
- See detailed metrics on your performance


What You Need

- Python 3.8 or higher
- Google Gemini API key (free)
- Any modern web browser
- Ports 5002 and 3000 available


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
