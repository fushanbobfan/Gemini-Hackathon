import os
import json
import io
import PyPDF2
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai  # Use the new SDK

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
    try:
        goal = request.form.get('goal', 'General')
        sub_type = request.form.get('sub_type', 'Interview')
        user_response = request.form.get('text_input', '')
        context_text = request.form.get('context_text', '')

        resume_content = "No resume provided."
        uploaded_file = request.files.get('file')
        if uploaded_file:
            pdf_stream = io.BytesIO(uploaded_file.read())
            resume_content = extract_text_from_pdf(pdf_stream)

        prompt = f"""
        You are an expert interview coach for {goal} ({sub_type}).
        RESUME: {resume_content}
        NOTES: {context_text}
        USER RESPONSE: "{user_response}"
        
        TASK: Return ONLY a JSON object with "score" (0-100) and "evaluation".
        """

        # 2. Correct syntax for the new SDK
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt
        )
        
        # 3. Handle the response text
        raw_text = response.text
        clean_text = raw_text.replace('```json', '').replace('```', '').strip()
        
        ai_data = json.loads(clean_text)
        return jsonify(ai_data)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"score": 0, "evaluation": f"Backend Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)