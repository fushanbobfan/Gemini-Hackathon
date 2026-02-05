import os
import json
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from PIL import Image

app = Flask(__name__)
CORS(app)

# --- CONFIGURATION ---
client = genai.Client(api_key="API_KEY_PLACEHOLDER") 
MODEL_ID = "gemini-2.5-flash"

@app.route('/api/evaluate', methods=['POST'])
def evaluate_interview():
    try:
        print("\n" + "="*60)
        print("🎯 NEW INTERVIEW ANALYSIS REQUEST")
        print("="*60)
        
        # 1. Get all inputs
        user_typed_text = request.form.get('text_input', '').strip()
        question_context = request.form.get('context_text', 'General Interview Question')
        
        print(f"📝 Question: {question_context}")
        print(f"⌨️  Typed text: {'Yes (' + str(len(user_typed_text)) + ' chars)' if user_typed_text else 'No'}")
        
        # Get camera image
        camera_image = None
        if 'camera_frame' in request.files:
            camera_image = Image.open(request.files['camera_frame'])
            print(f"📹 Camera snapshot: ✅ Received")
        else:
            print(f"📹 Camera snapshot: ❌ Missing")
        
        # Get audio file
        audio_data = None
        if 'audio_recording' in request.files:
            audio_file = request.files['audio_recording']
            audio_data = audio_file.read()
            print(f"🎤 Audio recording: ✅ Received ({len(audio_data)} bytes)")
        else:
            print(f"🎤 Audio recording: ❌ Missing")

        # 2. Build comprehensive prompt
        prompt = f"""
You are an expert Interview Coach performing a comprehensive analysis.

CONTEXT:
The candidate is answering: "{question_context}"

YOU RECEIVED:
- VIDEO: Snapshot of candidate's face during response
- AUDIO: 5-second recording of candidate speaking
- TEXT: {'"' + user_typed_text + '"' if user_typed_text else 'Not provided (candidate used audio only)'}

YOUR TASK:

Step 1: TRANSCRIBE the audio recording word-for-word

Step 2: Perform TWO INDEPENDENT ANALYSES:

═══════════════════════════════════════════
A) VERBAL ANALYSIS (Audio + Text Content)
═══════════════════════════════════════════
Evaluate the CONTENT and DELIVERY:

Content Quality:
- Did they answer the question directly?
- Is it structured (STAR method: Situation, Task, Action, Result)?
- Is it specific and relevant?
- Professional tone and language?

If typed text was provided:
- Compare audio vs typed text for consistency
- Note if typed text adds important details

Vocal Delivery (from audio):
- Pace: Too fast, too slow, or natural?
- Clarity: Clear pronunciation or mumbled?
- Confidence: Voice strength and conviction
- Filler words: Count "um", "uh", "like", "you know"
- Pauses: Natural vs awkward silences

Score: 0-100 (higher = better answer + delivery)

═══════════════════════════════════════════
B) NON-VERBAL ANALYSIS (Video Only)
═══════════════════════════════════════════
Analyze ONLY the visual snapshot - ignore audio content:

- Eye contact: Looking at camera (good) vs away (bad)
- Facial expression: Confident, friendly, engaged?
- Smile: Genuine (Duchenne) vs forced?
- Stress indicators: Frowning, tension, discomfort?
- Overall presence: Professional and composed?

Score: 0-100 (completely independent of verbal score)

═══════════════════════════════════════════

OUTPUT FORMAT (JSON only, no extra text):
{{
    "transcription": "<exact words from audio recording>",
    "verbal_score": <0-100>,
    "verbal_feedback": "<Detailed critique: content quality + vocal delivery. If typed text provided, mention how it compares to audio. Be specific about what was good and what needs improvement.>",
    "visual_score": <0-100>,
    "visual_feedback": "<Detailed critique of facial expressions and body language only. Do NOT mention audio or text content here.>",
    "coaching_tip": "<One powerful, actionable tip that synthesizes insights from BOTH verbal and non-verbal analysis to help them improve overall.>"
}}
"""

        # 3. Build content payload with all inputs
        content_payload = [prompt]
        
        if audio_data:
            content_payload.append({
                "mime_type": "audio/webm",
                "data": audio_data
            })
            print("📦 Added audio to Gemini payload")
        
        if camera_image:
            content_payload.append(camera_image)
            print("📦 Added image to Gemini payload")

        # 4. Call Gemini API
        print("🔄 Calling Gemini API...")
        response = None
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=MODEL_ID,
                    contents=content_payload
                )
                print("✅ Gemini response received")
                break
            except Exception as e:
                error_msg = str(e)
                if "429" in error_msg:
                    print(f"⚠️  Rate limit hit (attempt {attempt + 1}/3), waiting...")
                    time.sleep(2)
                else:
                    print(f"❌ API Error: {error_msg}")
                    raise e
        
        if not response:
            print("❌ Failed after 3 attempts")
            return jsonify({"error": "Server busy, please try again"}), 429

        # 5. Parse and return results
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        result = json.loads(clean_text)
        
        print(f"\n📊 RESULTS:")
        print(f"   Verbal Score: {result.get('verbal_score')}/100")
        print(f"   Visual Score: {result.get('visual_score')}/100")
        if result.get('transcription'):
            print(f"   Transcription: {result.get('transcription')[:80]}...")
        print("="*60 + "\n")
        
        return jsonify(result)

    except json.JSONDecodeError as e:
        print(f"❌ JSON Parse Error: {e}")
        print(f"Raw response: {response.text if response else 'No response'}")
        return jsonify({
            "verbal_score": 0,
            "verbal_feedback": "Error parsing AI response. Please try again.",
            "visual_score": 0,
            "visual_feedback": "Analysis failed",
            "coaching_tip": "Technical error occurred",
            "transcription": ""
        }), 500
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "verbal_score": 0,
            "verbal_feedback": f"Server error: {str(e)}",
            "visual_score": 0,
            "visual_feedback": "Analysis failed",
            "coaching_tip": "Please try again",
            "transcription": ""
        }), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 AI INTERVIEW COACH - BACKEND SERVER")
    print("="*60)
    print("📍 Server: http://localhost:5000")
    print("📋 Endpoint: POST /api/evaluate")
    print("📥 Accepts: Video + Audio + Text (all together)")
    print("="*60 + "\n")
    app.run(debug=True, port=5000, host='0.0.0.0')