import React, { useState } from 'react';
import { Upload, FileText, Zap, CheckCircle, Moon, Sun, Loader2 } from 'lucide-react';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [result, setResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert('Please upload a resume first');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("https://ai-resume-critic.onrender.com/analyze", {
        method: "POST",
        body: formData, 
      });
      const data = await response.json();
      setResult(data.analysis);
    } catch (err) {
      console.log("upload error: ", err);
      alert('Error analyzing resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
        <header className={`header ${darkMode ? 'dark-mode' : ''}`}>
          <div className="header-content">
            <FileText className="logo-icon" size={32} />
            <h1 className="header-title">Resume AI Critic</h1>
            <div>
              <button 
                onClick={toggleDarkMode}
                className="glow-toggle"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun size={24} className="glow-icon" />
                ) : (
                  <Moon size={24} className="glow-icon" />
                )}
              </button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="loading-container">
            <Loader2 className="loading-icon" size={48} />
            <p>Analyzing your resume...</p>
          </div>
        ) : result.overallScore ? (
          <section className={`result-section ${darkMode ? 'dark-mode' : ''}`}>
            <h2 className="result-title">Analysis Result</h2>
            <div className="result-score">
              <div className="score-circle">
                <span>{result.overallScore}</span>
                <small>Overall Score</small>
              </div>
            </div>
            
            <div className="result-summary">
              <h3>Summary</h3>
              <p>{result.summary}</p>
            </div>
            
            <div className="result-grid">
              <div className="result-card strengths">
                <h3>Strengths</h3>
                <ul>
                  {result.strengths?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="result-card weaknesses">
                <h3>Areas for Improvement</h3>
                <ul>
                  {result.weaknesses?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="result-card missing">
                <h3>Missing Skills</h3>
                <ul>
                  {result.missingSkills?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="result-card suggestions">
                <h3>Suggestions</h3>
                <ul>
                  {result.suggestions?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="result-actions">
              <h3>Action Items</h3>
              <ol>
                {result.actionItems?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
            
            <button 
              className={`new-analysis-btn ${darkMode ? 'dark-mode' : ''}`}
              onClick={() => setResult({})}
            >
              Analyze Another Resume
            </button>
          </section>
        ) : (
          <section className={`hero-section ${darkMode ? 'dark-mode' : ''}`}>
            <div className="hero-content">
              <h2 className="hero-title">Get Instant AI-Powered Resume Feedback</h2>
              <p className="hero-subtitle">
                Upload your resume and receive personalized suggestions to improve your chances of landing that dream job!
              </p>
              <p className="hero-description">
                Our AI analyzes your resume against industry standards and best practices.
              </p>

              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon blue">
                    <Zap size={32} />
                  </div>
                  <h3 className="feature-title">Instant Analysis</h3>
                  <p className="feature-text">Get feedback in seconds, not days</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon green">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="feature-title">Expert Insights</h3>
                  <p className="feature-text">AI trained on thousands of successful resumes</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon purple">
                    <FileText size={32} />
                  </div>
                  <h3 className="feature-title">ATS Optimization</h3>
                  <p className="feature-text">Ensure your resume passes screening systems</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className={`upload-section ${darkMode ? 'dark-mode' : ''}`}>
          <div className="upload-container">
            <div className={`upload-card ${darkMode ? 'dark-mode' : ''}`}>
              <h3 className="upload-title">Upload Your Resume</h3>

              <div className="form-group">
                <label className="form-label">Resume File *</label>
                <div 
                  className={`file-upload-area ${selectedFile ? 'has-file' : ''} ${darkMode ? 'dark-mode' : ''}`}
                  onClick={() => document.getElementById('resume-upload').click()}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="file-input"
                    id="resume-upload"
                  />
                  <Upload className="upload-icon" size={48} />
                  <p className="upload-text">
                    {selectedFile ? selectedFile.name : 'Choose your resume file'}
                  </p>
                  <p className="upload-subtext">
                    Supports PDF, DOC, DOCX files up to 10MB
                  </p>
                </div>
                {selectedFile && (
                  <div className="file-selected">
                    <CheckCircle size={16} />
                    <span>File selected: {selectedFile.name}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Job Description (Optional)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get tailored feedback on how well your resume matches the role..."
                  className={`textarea ${darkMode ? 'dark-mode' : ''}`}
                />
                <p className="help-text">
                  Adding a job description helps us provide more targeted suggestions
                </p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!selectedFile || isLoading}
                className={`generate-btn ${selectedFile && !isLoading ? 'enabled' : 'disabled'} ${darkMode ? 'dark-mode' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="loading-icon-btn" size={18} />
                    Analyzing...
                  </>
                ) : selectedFile ? (
                  'Analyze My Resume'
                ) : (
                  'Upload Resume First'
                )}
              </button>
            </div>

            <div className="additional-info">
              <p>Your resume is processed securely and is not stored on our servers</p>
            </div>
          </div>
        </section>

        <footer className={`footer ${darkMode ? 'dark-mode' : ''}`}>
          <div className="footer-content">
            <p>© 2025 Resume AI Critic. Helping job seekers land their dream jobs.</p>
          </div>
        </footer>
      </div>
      </div>
  );
};

export default App;