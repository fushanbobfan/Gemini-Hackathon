// App.js
import React, { useState } from 'react';

function App() {
  const [interviewGoal, setInterviewGoal] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  
  const [evaluation, setEvaluation] = useState(null);

  const mediaRecorderRef = React.useRef(null);

  const startRecording = async () => {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0){
          audioChunks.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      setAudioURL(URL.createObjectURL(audioBlob));
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
    setEvaluation(null);
    }
    catch (err){
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording){
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStart = async () => {
    // Call backend API to set context 
    console.log("Starting interview for:", interviewGoal);
    setEvaluation(null); // Reset previous evaluation
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>AI Interview Prep Tool</h1>
      
      {/* Input Section: Week 3 Focus  */}
      <section>
        <h3>Step 1: Set Your Goal</h3>
        <select value={interviewGoal} onChange={(e) => setInterviewGoal(e.target.value)}>
          <option value="">Select Interview Type</option>
          <option value="university">University</option>
          <option value="club">Club</option>
          <option value="job_tech">Job (Tech)</option>
        </select>
      </section>

      {/* Document/Audio Input: Week 4 Focus  */}
      <section style={{ marginTop: '20px' }}>
        <h3>Step 2: Upload Context (Resume/JD)</h3>
        <input type="file" accept=".pdf,.doc" />
        
        <h3 style={{ marginTop: '10px' }}>Step 3: Audio/Text Input</h3>
        <div style={{ marginBottom: '15px' }}>
          {!isRecording ? (
            <button onClick={startRecording} style={{backgroundColor: '#28a745'}}>
              🎤 Start Recording
            </button>
          ) : (
            <button onClick={stopRecording} style={{backgroundColor: '#dc3545'}}>
              ⏹ Stop Recording
            </button>
          )}
          
          {/* Playback */}
          {audioURL && (
            <div style={{ marginTop: '10px' }}>
              <audio src={audioURL} controls />
            </div>
          )}
        </div>
        <textarea placeholder="Paste interview questions or your response here..." />
        <button onClick={handleStart}>Submit for Evaluation</button>
      </section>

      {/* Output Section: Score & Evaluation  */}
      {evaluation && (
        <section style={{ marginTop: '30px', border: '1px solid #ccc' }}>
          <h2>Evaluation Results</h2>
          <p><strong>Score:</strong> {evaluation.score}/100</p>
          <p><strong>Feedback:</strong> {evaluation.evaluation}</p>
        </section>
      )}
    </div>
  );
}

export default App;