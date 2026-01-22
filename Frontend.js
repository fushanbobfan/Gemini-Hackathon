// App.js
import React, { useState } from 'react';

function App() {
  const [interviewGoal, setInterviewGoal] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const handleStart = async () => {
    // Call backend API to set context 
    console.log("Starting interview for:", interviewGoal);
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>AI Interview Prep Tool</h1>
      
      {/* Input Section: Week 3 Focus  */}
      <section>
        <h3>Step 1: Set Your Goal</h3>
        <select onChange={(e) => setInterviewGoal(e.target.value)}>
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