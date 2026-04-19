import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { getCurrentUserEmail, getUserWithSavedData, updateUser } from '../services/userService.js'
import './profile.css'

function Profile() {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phoneNumber: '',
    
    // Education
    educationLevel: '',
    major: '',
    school: '',
    
    // Experience
    position: '',
    fromDate: '',
    untilDate: '',
    isCurrentlyWorking: false,
    companyName: '',
    
    // About You
    aboutYou: '',
    
    // Resume
    resumeFile: null
  })

  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAboutYouChange = (e) => {
    const text = e.target.value
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length
    
    if (wordCount <= 400) {
      setFormData(prev => ({
        ...prev,
        aboutYou: text
      }))
      
      if (errors.aboutYou) {
        setErrors(prev => ({
          ...prev,
          aboutYou: ''
        }))
      }
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        resumeFile: file
      }))
      
      if (errors.resumeFile) {
        setErrors(prev => ({
          ...prev,
          resumeFile: ''
        }))
      }
    } else {
      setErrors(prev => ({
        ...prev,
        resumeFile: 'Please upload a PDF file only'
      }))
    }
  }

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      resumeFile: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCurrentlyWorkingChange = (e) => {
    const isCurrentlyWorking = e.target.checked
    setFormData(prev => ({
      ...prev,
      isCurrentlyWorking,
      untilDate: isCurrentlyWorking ? '' : prev.untilDate
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Personal Information validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }
    
    // Education validation
    if (!formData.educationLevel) {
      newErrors.educationLevel = 'Education level is required'
    }
    
    if (!formData.major.trim()) {
      newErrors.major = 'Major is required'
    }
    
    if (!formData.school.trim()) {
      newErrors.school = 'School is required'
    }
    
    // Experience validation
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required'
    }
    
    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required'
    }
    
    if (!formData.isCurrentlyWorking && !formData.untilDate) {
      newErrors.untilDate = 'Until date is required'
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      const email = getCurrentUserEmail()
      if (email) {
        // Map form data to user.json structure
        const userData = {
          fullName: formData.fullName,
          emailAddress: formData.email,
          phoneNumber: formData.phoneNumber,
          educationLevel: formData.educationLevel,
          major: formData.major,
          school: formData.school,
          position: formData.position,
          companyName: formData.companyName,
          from: formData.fromDate,
          until: formData.isCurrentlyWorking ? 'present' : formData.untilDate,
          about: formData.aboutYou
        }
        updateUser(email, userData)
        alert('Profile saved successfully!')
      } else {
        alert('Please sign in first')
      }
    }
  }

  const handleCancel = () => {
    // Reload user data to reset form
    loadUserData()
  }

  // Load user data on mount
  const loadUserData = () => {
    const email = getCurrentUserEmail()
    if (email) {
      const user = getUserWithSavedData(email)
      if (user) {
        setFormData({
          fullName: user.fullName || '',
          email: user.emailAddress || user.email || '',
          phoneNumber: user.phoneNumber || '',
          educationLevel: user.educationLevel || '',
          major: user.major || '',
          school: user.school || '',
          position: user.position || '',
          fromDate: user.from || '',
          untilDate: user.until === 'present' ? '' : user.until || '',
          isCurrentlyWorking: user.until === 'present',
          companyName: user.companyName || '',
          aboutYou: user.about || '',
          resumeFile: null
        })
      }
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  const getWordCount = () => {
    return formData.aboutYou.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharCounterClass = () => {
    const wordCount = getWordCount()
    if (wordCount >= 400) return 'error'
    if (wordCount >= 350) return 'warning'
    return ''
  }

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-main">
        <div className="profile-header">
          <h1 className="profile-title">Your Profile</h1>
          <p className="profile-subtitle">Manage your personal information and professional details</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="profile-card">
            <h2 className="section-title">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label required">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label required">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label required">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="profile-card">
            <h2 className="section-title">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Education
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Education Level</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className={`form-select ${errors.educationLevel ? 'error' : ''}`}
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="associate">Associate Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
                {errors.educationLevel && <span className="error-message">{errors.educationLevel}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label required">Major/Field of Study</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className={`form-input ${errors.major ? 'error' : ''}`}
                  placeholder="e.g., Computer Science"
                />
                {errors.major && <span className="error-message">{errors.major}</span>}
              </div>
              
              <div className="form-group full-width">
                <label className="form-label required">School</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className={`form-input ${errors.school ? 'error' : ''}`}
                  placeholder="e.g., University of California"
                />
                {errors.school && <span className="error-message">{errors.school}</span>}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="profile-card">
            <h2 className="section-title">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Experience
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`form-input ${errors.position ? 'error' : ''}`}
                  placeholder="e.g., Software Engineer"
                />
                {errors.position && <span className="error-message">{errors.position}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label required">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.companyName ? 'error' : ''}`}
                  placeholder="e.g., Tech Company Inc."
                />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label required">From</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  className={`form-input ${errors.fromDate ? 'error' : ''}`}
                />
                {errors.fromDate && <span className="error-message">{errors.fromDate}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label required">Until</label>
                <input
                  type="date"
                  name="untilDate"
                  value={formData.untilDate}
                  onChange={handleInputChange}
                  disabled={formData.isCurrentlyWorking}
                  className={`form-input ${errors.untilDate ? 'error' : ''} ${formData.isCurrentlyWorking ? 'disabled' : ''}`}
                />
                {errors.untilDate && <span className="error-message">{errors.untilDate}</span>}
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="currently-working"
                    name="isCurrentlyWorking"
                    checked={formData.isCurrentlyWorking}
                    onChange={handleCurrentlyWorkingChange}
                    className="checkbox-input"
                  />
                  <label htmlFor="currently-working" className="checkbox-label">
                    Currently working here
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* About You Section */}
          <div className="profile-card">
            <h2 className="section-title">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About You
            </h2>
            <div className="form-group">
              <label className="form-label">Tell us about yourself</label>
              <textarea
                name="aboutYou"
                value={formData.aboutYou}
                onChange={handleAboutYouChange}
                className="form-textarea"
                placeholder="Share your professional background, skills, and career goals..."
                rows="6"
              />
              <div className={`char-counter ${getCharCounterClass()}`}>
                {getWordCount()} / 400 words
              </div>
              {errors.aboutYou && <span className="error-message">{errors.aboutYou}</span>}
            </div>
          </div>

          {/* Resume Section */}
          <div className="profile-card">
            <h2 className="section-title">
              <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Add Your Resume
            </h2>
            <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="file-upload-input"
              />
              <svg className="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="file-upload-text">
                {formData.resumeFile ? 'Click to change file' : 'Click to upload or drag and drop'}
              </div>
              <div className="file-upload-hint">PDF files only (MAX. 10MB)</div>
            </div>
            
            {formData.resumeFile && (
              <div className="file-preview">
                <div className="file-info">
                  <svg className="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="file-name">{formData.resumeFile.name}</span>
                </div>
                <button type="button" onClick={handleRemoveFile} className="file-remove">
                  Remove
                </button>
              </div>
            )}
            
            {errors.resumeFile && <span className="error-message">{errors.resumeFile}</span>}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}

export default Profile