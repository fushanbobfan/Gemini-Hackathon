import React, { useState } from 'react';
import './App.css';

function App() {
  const [ageGroup, setAgeGroup] = useState('');
  const [interviewGoal, setInterviewGoal] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [contextText, setContextText] = useState('');
  const [textInput, setTextInput] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = React.useRef(null);
  const API_BASE_URL = 'http://localhost:5002';

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
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
      setError(null);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ageGroup) {
      setError('Please select your age group');
      return;
    }
    
    if (!interviewGoal) {
      setError('Please select an interview type');
      return;
    }
    
    if (!textInput && !audioBlob) {
      setError('Please provide either text or audio response');
      return;
    }

    setLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const formData = new FormData();
      formData.append('age_group', ageGroup);
      formData.append('goal', interviewGoal);
      formData.append('sub_type', 'Interview');
      formData.append('text_input', textInput);
      formData.append('context_text', contextText);

      if (resumeFile) {
        formData.append('file', resumeFile);
      }

      if (audioBlob) {
        formData.append('audio_response', audioBlob, 'audio.wav');
      }

      const response = await fetch(`${API_BASE_URL}/api/evaluate`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.evaluation || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setEvaluation(data);
      
      // Clear form on success
      setTextInput('');
      setAudioBlob(null);
      setAudioURL(null);
    } catch (err) {
      console.error('Submission error:', err);
      setError(`Failed to evaluate: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Personalized Interview Support For All Ages</h1>
        <p className="subtitle">
          Master your interview responses with AI-powered coaching<br/>
          Customized for everyone — from middle school to the workforce
        </p>
        
        {/* Age Group Badges */}
        <div className="age-groups">
          {['📚 Middle School', '🎓 High School', '🏛️ College', '💼 Workforce'].map((badge) => (
            <div key={badge} className="age-badge">
              {badge}
            </div>
          ))}
        </div>
      </header>

      <main className="app-container">
        <form className="form-container" onSubmit={handleSubmit}>
          
          {/* Step 1: Age Group */}
          <section className="form-section">
            <div className="section-number">1</div>
            <div className="section-content">
              <h2>Select Your Age Group</h2>
              <select 
                value={ageGroup} 
                onChange={(e) => setAgeGroup(e.target.value)}
                className="select-input"
              >
                <option value="">Choose your age group...</option>
                <option value="middle_school">📚 Middle School (11-14 years)</option>
                <option value="high_school">🎓 High School (14-18 years)</option>
                <option value="college">🏛️ College/University (18-25 years)</option>
                <option value="early_career">💼 Early Career (22-30 years)</option>
                <option value="mid_career">🚀 Mid Career (30-45 years)</option>
                <option value="senior_career">👔 Senior Professional (45+ years)</option>
              </select>
            </div>
          </section>

          {/* Step 2: Interview Goal */}
          <section className="form-section">
            <div className="section-number">2</div>
            <div className="section-content">
              <h2>Select Interview Type</h2>
              <select 
                value={interviewGoal} 
                onChange={(e) => setInterviewGoal(e.target.value)}
                className="select-input"
              >
                <option value="">Choose interview type...</option>
                <option value="school">🏫 School Interview</option>
                <option value="club">🤝 Club/Organization Interview</option>
                <option value="university">🎓 University Admission</option>
                <option value="job_tech">💻 Tech Job Interview</option>
                <option value="job_general">💼 General Job Interview</option>
                <option value="internship">📋 Internship Interview</option>
              </select>
            </div>
          </section>

          {/* Step 3: Upload Context */}
          <section className="form-section">
            <div className="section-number">3</div>
            <div className="section-content">
              <h2>Upload Context (Optional)</h2>
              <div className="file-input-wrapper">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="file-input"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="file-label">
                  📄 {resumeFile ? resumeFile.name : 'Choose Resume or Job Description'}
                </label>
              </div>
              
              <textarea 
                placeholder="Add any additional context, notes, or interview questions..."
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                className="textarea-input"
                rows="3"
              />
            </div>
          </section>

          {/* Step 4: Record or Write Response */}
          <section className="form-section">
            <div className="section-number">4</div>
            <div className="section-content">
              <h2>Provide Your Response</h2>
              
              <div className="audio-section">
                <h3>Record Audio Response</h3>
                <div className="button-group">
                  {!isRecording ? (
                    <button 
                      type="button"
                      onClick={startRecording}
                      className="btn btn-primary"
                    >
                      🎤 Start Recording
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={stopRecording}
                      className="btn btn-danger"
                    >
                      ⏹ Stop Recording
                    </button>
                  )}
                  {audioURL && (
                    <div className="audio-playback">
                      <audio src={audioURL} controls className="audio-player" />
                    </div>
                  )}
                </div>
              </div>

              <div className="or-divider">OR</div>

              <div className="text-section">
                <h3>Write Text Response</h3>
                <textarea 
                  placeholder="Type your interview response here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="textarea-input"
                  rows="6"
                />
              </div>
            </div>

          </section>

          {/* Live Interview Mode Button */}
          <section className="form-section" style={{ justifyContent: 'center', textAlign: 'center', marginTop: '10px' }}>
            <div className="section-number" style={{ background: 'var(--morandi-dust-blue)' }}>5</div>
            <div className="section-content">
              <h2>Want a More Realistic Experience?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '1.05em' }}>
                Try the live interview mode with real-time video, audio, and transcription
              </p>
              <button
                type="button"
                className="btn btn-submit"
                onClick={() => window.location.href = '/camera.html'}
              >
                📹 Launch Live Interview Mode
              </button>
            </div>
          </section>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-submit"
            disabled={loading}
          >
            {loading ? '⏳ Evaluating...' : '✨ Get AI Evaluation'}
          </button>
        </form>


        {/* Results Section */}
        {evaluation && (
          <section className="results-section">
            <h2>📊 Your Evaluation Results</h2>
            
            <div className="score-card">
              <div className="score-display">
                <span className="score-number">{evaluation.score}</span>
                <span className="score-max">/100</span>
              </div>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{width: `${evaluation.score}%`}}
                />
              </div>
            </div>

            <div className="evaluation-text">
              <h3>Detailed Feedback</h3>
              <p>{evaluation.evaluation}</p>
            </div>

            {evaluation.metrics && (
              <div className="metrics-grid">
                <h3>Performance Metrics</h3>
                <div className="metrics-list">
                  {Object.entries(evaluation.metrics).map(([key, value]) => (
                    <div key={key} className="metric-item">
                      <span className="metric-label">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className="metric-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              type="button"
              onClick={() => setEvaluation(null)}
              className="btn btn-secondary"
            >
              ← Try Another Response
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;