import os
import json
import io
import PyPDF2
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai  # Use the new SDK
import tempfile

app = Flask(__name__)
CORS(app)

# 1. Initialize the new Client
# It will automatically look for the GEMINI_API_KEY environment variable
client = genai.Client(api_key="USE YOUR OWN KEY") # TODO - Remember to replace with your own key
MODEL_ID = "gemini-2.0-flash" # Use a stable ID or 'gemini-2.0-flash'

def extract_text_from_pdf(pdf_file):
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            content = page.extract_text()
            if content:
                text += content
        return text
    except Exception as e:
        return f"Could not read PDF: {str(e)}"

@app.route('/api/evaluate', methods=['POST'])
def evaluate_interview():
    temp_path = None
    try:
        goal = request.form.get('goal', 'General')
        sub_type = request.form.get('sub_type', 'Interview')
        user_response = request.form.get('text_input', '')
        context_text = request.form.get('context_text', '')
        audio_response = request.files.get('audio_response')

        resume_content = "No resume provided."
        uploaded_file = request.files.get('file')
        if uploaded_file:
            pdf_stream = io.BytesIO(uploaded_file.read())
            resume_content = extract_text_from_pdf(pdf_stream)

        prompt = f"""
        You are an expert interview coach for {goal} ({sub_type}).
        RESUME: {resume_content}
        CONTEXT/NOTES: {context_text}
        USER RESPONSE: "{user_response}"
        
        TASK: 
        1. Analyze the audio response based on the position requested.
        2. Evaluate speech patterns: pacing, tone, filler words, stutters.
        3. Assess other soft qualities: confidence, clarity, engagement, professionalism.
        4. Assess other additional qualities based on the context and role provided. 
        5. Provide a total score (0-100) and detailed evaluation.
        Return ONLY a JSON object with this structure: 
        {{
          "score": 0-100,
          "evaluation": "string",
          "metrics": {{
            "filler_word_count": "string",
            "tone_analysis": "string",
            "pacing": "string"
            "confidence": "string",
            "clarity": "string",
            "stutters": "string",
            "engagement": "string",
            "professionalism": "string",
            "additional_qualities": "string"
          }}
        }}
        """
        contents = [prompt]

        if audio_response:
            suffix = os.path.splitext(audio_response.filename)[1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_audio_file:
                audio_response.save(temp_audio_file.name)
                temp_path = temp_audio_file.name
            
            uploaded_audio = client.files.upload(file = temp_path, mime_type=audio_response.mimetype)
            contents.append(uploaded_audio)

        # 2. Correct syntax for the new SDK
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=contents,
            config=genai.types.GenerateContentConfig(response_mime_type='application/json')
        )
        
        # 3. Handle the response text
        raw_text = response.text
        clean_text = raw_text.replace('```json', '').replace('```', '').strip()
        
        ai_data = json.loads(clean_text)
        return jsonify(ai_data)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"score": 0, "evaluation": f"Backend Error: {str(e)}"}), 500
    
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)