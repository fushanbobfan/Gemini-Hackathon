import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  // Page navigation state
  const [currentStep, setCurrentStep] = useState(0);

  const [ageGroup, setAgeGroup] = useState('');
  const [interviewGoal, setInterviewGoal] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState(''); // Extracted text from PDF
  const [contextText, setContextText] = useState('');
  const [textInput, setTextInput] = useState('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mediaRecorderRef = React.useRef(null);
  const cardsRef = useRef(null);
  const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5002';

  // Scroll animation for cards section
  useEffect(() => {
    if (currentStep !== 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach(el => observer.observe(el));
    }, 100);
    
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [currentStep]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Use WebM with Opus codec for aggressive compression
      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000 // 16kbps - very small size, acceptable quality for speech
      };

      // Fallback if webm not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mediaRecorderRef.current.mimeType });
        setAudioBlob(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));

        const sizeMB = audioBlob.size / (1024 * 1024);
        console.log(`Audio recorded: ${sizeMB.toFixed(2)}MB`);
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

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText.trim();
    } catch (err) {
      console.error('PDF extraction error:', err);
      throw new Error('Could not extract text from PDF');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setError(null);

      // Extract text from PDF to send instead of the full file
      if (file.type === 'application/pdf') {
        try {
          const text = await extractTextFromPDF(file);
          setResumeText(text);
          console.log(`Extracted ${text.length} characters from PDF (vs ${file.size} bytes file)`);
        } catch (err) {
          setError('Could not read PDF file. Please try another format.');
          setResumeFile(null);
        }
      }
    }
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

      // Send extracted PDF text + context instead of the full PDF file
      const combinedContext = resumeText
        ? `RESUME:\n${resumeText}\n\nADDITIONAL NOTES:\n${contextText}`
        : contextText;
      formData.append('context_text', combinedContext);

      if (audioBlob) {
        formData.append('audio_response', audioBlob, 'audio.webm');
      }

      // Estimate payload size (for debugging)
      let estimatedSize = 0;
      estimatedSize += new Blob([textInput]).size;
      estimatedSize += new Blob([combinedContext]).size;
      if (audioBlob) estimatedSize += audioBlob.size;
      const sizeMB = estimatedSize / (1024 * 1024);
      console.log(`Estimated payload: ${sizeMB.toFixed(2)}MB`);

      if (sizeMB > 4) {
        setError(`Payload too large (${sizeMB.toFixed(1)}MB). Try shorter recording or less text.`);
        setLoading(false);
        return;
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
      {/* ==================== STEP 0: LANDING PAGE ==================== */}
      {currentStep === 0 && (
        <>
          <section className="hero-fullscreen">
            <div className="hero-bg-orbs">
              <div className="orb orb-1"></div>
              <div className="orb orb-2"></div>
              <div className="orb orb-3"></div>
            </div>
            <div className="shooting-star"></div>
            <div className="shooting-star star-2"></div>
            <div className="sparkles">
              <div className="sparkle s1">✦</div>
              <div className="sparkle s2">✧</div>
              <div className="sparkle s3">✦</div>
              <div className="sparkle s4">✧</div>
              <div className="sparkle s5">✦</div>
              <div className="sparkle s6">✧</div>
            </div>
            <div className="hero-content">
              <div className="brand-logo">
                <span className="logo-icon"></span>
              </div>
              <h1 className="hero-title-big">
                <span className="title-line title-line-1">Interview</span>
                <span className="title-line title-line-2">Interview Maestro</span>
              </h1>
              <p className="hero-desc hero-desc-1">AI-Powered Interview Preparation</p>
              <p className="hero-desc hero-desc-2">Practice smarter. Perform better. Land your dream opportunity.</p>
              <div className="hero-scroll-arrow">↓</div>
            </div>
          </section>
          
          <main className="app-container cards-section" ref={cardsRef}>
            <h2 className="section-title scroll-reveal">Choose Your Path</h2>
            <p className="section-subtitle scroll-reveal">Select the interview category that fits your goal</p>
            <div className="category-cards">
              <div 
                className="category-card academic scroll-reveal reveal-delay-1"
                onClick={() => {
                  setInterviewGoal('academic');
                  setCurrentStep(1);
                }}
              >
                <div className="card-icon">🎓</div>
                <h2>Academic</h2>
                <p>University admissions, scholarships, graduate programs</p>
                <div className="card-tags">
                  <span>College Interview</span>
                  <span>Scholarship</span>
                  <span>Grad School</span>
                </div>
                <button className="card-btn">Start Practice →</button>
              </div>
              
              <div 
                className="category-card social scroll-reveal reveal-delay-2"
                onClick={() => {
                  setInterviewGoal('social');
                  setCurrentStep(1);
                }}
              >
                <div className="card-icon">🤝</div>
                <h2>Social</h2>
                <p>Club leadership, student organizations, volunteer positions</p>
                <div className="card-tags">
                  <span>Club Leadership</span>
                  <span>Student Org</span>
                  <span>Volunteer</span>
                </div>
                <button className="card-btn">Start Practice →</button>
              </div>
              
              <div 
                className="category-card career scroll-reveal reveal-delay-3"
                onClick={() => {
                  setInterviewGoal('career');
                  setCurrentStep(1);
                }}
              >
                <div className="card-icon">💼</div>
                <h2>Career</h2>
                <p>Tech jobs, internships, professional opportunities</p>
                <div className="card-tags">
                  <span>Tech Interview</span>
                  <span>Internship</span>
                  <span>Job Offer</span>
                </div>
                <button className="card-btn">Start Practice →</button>
              </div>
            </div>
          </main>
        </>
      )}

      {/* ==================== STEP 1: SELECT AGE GROUP ==================== */}
      {currentStep === 1 && (
        <>
          <header className="app-header step-header">
            <div className="step-indicator">
              <span className="step active">1</span>
              <span className="step-line"></span>
              <span className="step">2</span>
              <span className="step-line"></span>
              <span className="step">3</span>
            </div>
            <h1>Select Your Level</h1>
            <p className="subtitle">This helps us tailor questions and feedback for you</p>
          </header>
          
          <main className="app-container">
            <div className="age-cards">
              {[
                { value: 'middle_school', icon: '📚', label: 'Middle School', desc: 'Ages 11-14' },
                { value: 'high_school', icon: '🎓', label: 'High School', desc: 'Ages 14-18' },
                { value: 'college', icon: '🏛️', label: 'College', desc: 'Ages 18-25' },
                { value: 'early_career', icon: '💼', label: 'Early Career', desc: 'Ages 22-30' },
                { value: 'mid_career', icon: '🚀', label: 'Mid Career', desc: 'Ages 30-45' },
                { value: 'senior_career', icon: '👔', label: 'Senior', desc: 'Ages 45+' },
              ].map((item) => (
                <div 
                  key={item.value}
                  className={`age-card ${ageGroup === item.value ? 'selected' : ''}`}
                  onClick={() => setAgeGroup(item.value)}
                >
                  <span className="age-icon">{item.icon}</span>
                  <span className="age-label">{item.label}</span>
                  <span className="age-desc">{item.desc}</span>
                </div>
              ))}
            </div>
            
            <div className="step-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentStep(0)}
              >
                ← Back
              </button>
              <button 
                className="btn btn-submit"
                disabled={!ageGroup}
                onClick={() => setCurrentStep(2)}
              >
                Continue →
              </button>
            </div>
          </main>
        </>
      )}

      {/* ==================== STEP 2: UPLOAD CONTEXT ==================== */}
      {currentStep === 2 && (
        <>
          <header className="app-header step-header">
            <div className="step-indicator">
              <span className="step completed">✓</span>
              <span className="step-line completed"></span>
              <span className="step active">2</span>
              <span className="step-line"></span>
              <span className="step">3</span>
            </div>
            <h1>Add Context</h1>
            <p className="subtitle">Upload your resume or add notes to personalize the interview</p>
          </header>
          
          <main className="app-container">
            <div className="context-section">
              <div className="upload-area">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="file-input"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="upload-label">
                  <span className="upload-icon">📄</span>
                  <span className="upload-text">
                    {resumeFile ? resumeFile.name : 'Drop your resume or click to upload'}
                  </span>
                  <span className="upload-hint">PDF, DOC, DOCX supported</span>
                </label>
              </div>
              
              <div className="or-divider">OR</div>
              
              <textarea 
                placeholder="Add any context: job description, interview questions, notes about the position..."
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                className="context-textarea"
                rows="6"
              />
            </div>
            
            <div className="step-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                ← Back
              </button>
              <button 
                className="btn btn-submit"
                onClick={() => setCurrentStep(3)}
              >
                Continue →
              </button>
            </div>
          </main>
        </>
      )}

      {/* ==================== STEP 3: PRACTICE MODE ==================== */}
      {currentStep === 3 && (
        <>
          <header className="app-header step-header">
            <div className="step-indicator">
              <span className="step completed">✓</span>
              <span className="step-line completed"></span>
              <span className="step completed">✓</span>
              <span className="step-line completed"></span>
              <span className="step active">3</span>
            </div>
            <h1>Choose Practice Mode</h1>
            <p className="subtitle">Select how you'd like to practice</p>
          </header>
          
          <main className="app-container">
            <div className="mode-cards">
              <div className="mode-card" onClick={() => setCurrentStep(4)}>
                <div className="mode-icon">🎤</div>
                <h3>Quick Practice</h3>
                <p>Record your answer and get instant AI feedback</p>
                <ul className="mode-features">
                  <li>✓ Audio or text response</li>
                  <li>✓ Instant evaluation</li>
                  <li>✓ Detailed feedback</li>
                </ul>
                <button className="mode-btn">Start Quick Practice</button>
              </div>
              
              <div className="mode-card featured" onClick={() => window.location.href = '/camera.html'}>
                <div className="featured-badge">Recommended</div>
                <div className="mode-icon">📹</div>
                <h3>Live Interview</h3>
                <p>Full simulation with video, audio, and real-time transcription</p>
                <ul className="mode-features">
                  <li>✓ Video recording</li>
                  <li>✓ Real-time transcription</li>
                  <li>✓ Body language tips</li>
                </ul>
              </div>
            </div>
            
            <div className="step-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentStep(2)}
              >
                ← Back
              </button>
              <button 
                className="btn btn-submit"
                onClick={() => setCurrentStep(4)}
              >
                Quick Practice →
              </button>
            </div>
          </main>
        </>
      )}

      {/* ==================== STEP 4: QUICK PRACTICE (Record/Write) ==================== */}
      {currentStep === 4 && !evaluation && (
        <>
          <header className="app-header step-header">
            <button className="back-btn" onClick={() => setCurrentStep(3)}>← Back</button>
            <h1>Quick Practice</h1>
            <p className="subtitle">Record your answer or type it below</p>
          </header>
          
          <main className="app-container">
            <form className="practice-form" onSubmit={handleSubmit}>
              <div className="response-section">
                <div className="audio-section">
                  <h3>🎤 Record Your Answer</h3>
                  <div className="recording-area">
                    {!isRecording ? (
                      <button 
                        type="button"
                        onClick={startRecording}
                        className="record-btn"
                      >
                        <span className="record-icon">●</span>
                        Start Recording
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={stopRecording}
                        className="record-btn recording"
                      >
                        <span className="stop-icon">■</span>
                        Stop Recording
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
                  <h3>✍️ Type Your Answer</h3>
                  <textarea 
                    placeholder="Type your interview response here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="response-textarea"
                    rows="8"
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-error">
                  ⚠️ {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-submit"
                disabled={loading || (!textInput && !audioBlob)}
              >
                {loading ? '⏳ Analyzing...' : '✨ Get AI Feedback'}
              </button>
            </form>
          </main>
        </>
      )}

      {/* ==================== STEP 5: RESULTS ==================== */}
      {evaluation && (
        <>
          <header className="app-header step-header">
            <h1>📊 Your Results</h1>
            <p className="subtitle">Here's your personalized feedback</p>
          </header>
          
          <main className="app-container">
            <section className="results-section">
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

              <div className="result-actions">
                <button 
                  type="button"
                  onClick={() => {
                    setEvaluation(null);
                    setTextInput('');
                    setAudioBlob(null);
                    setAudioURL(null);
                    setCurrentStep(4);
                  }}
                  className="btn btn-secondary"
                >
                  🔄 Try Again
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setEvaluation(null);
                    window.location.href = '/camera.html';
                  }}
                  className="btn btn-live"
                >
                  🎥 Try Live Interview
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setEvaluation(null);
                    setCurrentStep(0);
                  }}
                  className="btn btn-secondary"
                >
                  🏠 Back to Home
                </button>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
