import React, { useState } from 'react';
import { Upload, FileText, Zap, CheckCircle, Moon, Sun } from 'lucide-react';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleGenerate = () => {
    if (!selectedFile) {
      alert('Please upload a resume first');
      return;
    }
    console.log('Generating analysis...');
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
                disabled={!selectedFile}
                className={`generate-btn ${selectedFile ? 'enabled' : 'disabled'} ${darkMode ? 'dark-mode' : ''}`}
              >
                {selectedFile ? 'Analyze My Resume' : 'Upload Resume First'}
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