# 🔍 Backend Status & Monitoring Guide

## ✅ Quick Status Check

### Health Endpoint
```bash
curl http://localhost:5002/api/health
```

**Response:**
```json
{
  "status": "Backend is running!",
  "port": 5002
}
```

## 📋 How to Monitor Backend

### 1. **Check if Process is Running**
```bash
ps aux | grep "python backend.py" | grep -v grep
```

### 2. **Check Port is Listening**
```bash
lsof -i :5002
# or
netstat -an | grep 5002
```

### 3. **Test API Endpoints**
```bash
# Health check
curl -X GET http://localhost:5002/api/health

# Test evaluate endpoint
curl -X POST http://localhost:5002/api/evaluate \
  -F "goal=job_tech" \
  -F "text_input=I have 5 years of experience" \
  -F "sub_type=Interview"
```

## 🚀 Starting the Backend

### Standard Start
```bash
cd /Users/alinaliu18/Gemini-Hackathon
export GEMINI_API_KEY="AIzaSyDUoc7599BzMBMZYnmhMeSPx-mwxfJlH3E"
python backend.py
```

### Background Start
```bash
cd /Users/alinaliu18/Gemini-Hackathon
GEMINI_API_KEY="AIzaSyDUoc7599BzMBMZYnmhMeSPx-mwxfJlH3E" python backend.py &
```

### With Logging
```bash
cd /Users/alinaliu18/Gemini-Hackathon
GEMINI_API_KEY="AIzaSyDUoc7599BzMBMZYnmhMeSPx-mwxfJlH3E" python backend.py > backend.log 2>&1 &
tail -f backend.log
```

## 🛑 Stopping the Backend

### Kill Specific Process
```bash
ps aux | grep "python backend.py" | grep -v grep | awk '{print $2}' | xargs kill
```

### Kill by Port
```bash
lsof -ti :5002 | xargs kill -9
```

### Kill All Python Backend Processes
```bash
pkill -f "python backend.py"
```

## 🔧 Troubleshooting

### Issue: "Address already in use"
```bash
# Check what's using the port
lsof -i :5002

# Kill the process
lsof -ti :5002 | xargs kill -9

# Restart backend
GEMINI_API_KEY="AIzaSyDUoc7599BzMBMZYnmhMeSPx-mwxfJlH3E" python backend.py
```

### Issue: "GEMINI_API_KEY not found"
```bash
# Make sure to export the API key
export GEMINI_API_KEY="AIzaSyDUoc7599BzMBMZYnmhMeSPx-mwxfJlH3E"

# Verify it's set
echo $GEMINI_API_KEY
```

### Issue: "Connection refused"
```bash
# Check if backend is running
curl http://localhost:5002/api/health

# If not, start it with API key
cd /Users/alinaliu18/Gemini-Hackathon
GEMINI_API_KEY="AIzaSyDUoc7599BzMBMZYnmhMeSPx-mwxfJlH3E" python backend.py
```

## 📊 Backend Configuration

**File**: `/Users/alinaliu18/Gemini-Hackathon/backend.py`

**Key Settings:**
- Port: `5002`
- Host: `127.0.0.1`
- Debug Mode: `False` (disabled for stability)
- Auto-reloader: `False` (disabled for faster startup)
- CORS: Enabled for all origins

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Check backend status |
| `/api/evaluate` | POST | Evaluate interview response |
| `/api/evaluate` | OPTIONS | CORS preflight |

## 📝 Request/Response Examples

### Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "Backend is running!",
  "port": 5002
}
```

### Evaluate Interview
```
POST /api/evaluate
Content-Type: multipart/form-data

goal=job_tech
text_input=Tell me about your experience
context_text=This is for a senior role
file=resume.pdf (optional)
audio_response=audio.wav (optional)
```

**Response:**
```json
{
  "score": 75,
  "evaluation": "Strong communication...",
  "metrics": {
    "filler_word_count": "3",
    "tone_analysis": "Professional and confident",
    "pacing": "Good",
    "confidence": "High",
    "clarity": "Very clear",
    "stutters": "None",
    "engagement": "Strong",
    "professionalism": "Excellent",
    "additional_qualities": "..."
  }
}
```

## 🎯 Monitoring Checklist

- [ ] Backend process is running (`ps aux | grep backend`)
- [ ] Port 5002 is listening (`lsof -i :5002`)
- [ ] Health endpoint responds (`curl http://localhost:5002/api/health`)
- [ ] API key is set (`echo $GEMINI_API_KEY`)
- [ ] CORS headers are correct
- [ ] Frontend can reach backend (test on localhost:3000)

## 📍 File Locations

- **Backend Script**: `/Users/alinaliu18/Gemini-Hackathon/backend.py`
- **Logs**: Look for output in terminal or create `backend.log`
- **Environment Config**: Set `GEMINI_API_KEY` in shell before starting

## 💡 Pro Tips

1. **Keep terminal open** while backend is running to see logs
2. **Use background start** with `&` if you need terminal for other tasks
3. **Create alias** for faster startup:
   ```bash
   alias start-backend='cd /Users/alinaliu18/Gemini-Hackathon && GEMINI_API_KEY="AIzaSyDUoc7599BzMBMZYnmhMeSPx-mwxfJlH3E" python backend.py'
   ```
4. **Monitor with watch** command (if available):
   ```bash
   watch -n 5 'curl -s http://localhost:5002/api/health | python -m json.tool'
   ```

---
**Last Updated**: January 31, 2026
**Backend Port**: 5002
**Status**: Production Ready ✅
