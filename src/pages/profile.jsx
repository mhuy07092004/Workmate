import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import { getCurrentUserEmail, findUserByEmail } from '../services/userService.js'

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
      // Profile save disabled - backend integration required
      alert('Profile save feature requires backend integration. Changes will not be persisted.')
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
      const user = findUserByEmail(email)
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Profile</h1>
          <p className="text-base text-slate-500">Manage your personal information and professional details</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.fullName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="text-xs text-red-500 mt-1">{errors.fullName}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && <span className="text-xs text-red-500 mt-1">{errors.phoneNumber}</span>}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Education
            </h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Education Level</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white ${errors.educationLevel ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="associate">Associate Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
                {errors.educationLevel && <span className="text-xs text-red-500 mt-1">{errors.educationLevel}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Major/Field of Study</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.major ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Computer Science"
                />
                {errors.major && <span className="text-xs text-red-500 mt-1">{errors.major}</span>}
              </div>

              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">School</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.school ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., University of California"
                />
                {errors.school && <span className="text-xs text-red-500 mt-1">{errors.school}</span>}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Experience
            </h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.position ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Software Engineer"
                />
                {errors.position && <span className="text-xs text-red-500 mt-1">{errors.position}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.companyName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Tech Company Inc."
                />
                {errors.companyName && <span className="text-xs text-red-500 mt-1">{errors.companyName}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">From</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.fromDate ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                />
                {errors.fromDate && <span className="text-xs text-red-500 mt-1">{errors.fromDate}</span>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Until</label>
                <input
                  type="date"
                  name="untilDate"
                  value={formData.untilDate}
                  onChange={handleInputChange}
                  disabled={formData.isCurrentlyWorking}
                  className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed ${errors.untilDate ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                />
                {errors.untilDate && <span className="text-xs text-red-500 mt-1">{errors.untilDate}</span>}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="currently-working"
                    name="isCurrentlyWorking"
                    checked={formData.isCurrentlyWorking}
                    onChange={handleCurrentlyWorkingChange}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <label htmlFor="currently-working" className="text-sm text-gray-700 cursor-pointer">
                    Currently working here
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* About You Section */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About You
            </h2>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1.5">Tell us about yourself</label>
              <textarea
                name="aboutYou"
                value={formData.aboutYou}
                onChange={handleAboutYouChange}
                className="px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y min-h-[120px]"
                placeholder="Share your professional background, skills, and career goals..."
                rows="6"
              />
              <div className={`text-right text-xs mt-1 ${getCharCounterClass() === 'error' ? 'text-red-500' : getCharCounterClass() === 'warning' ? 'text-amber-500' : 'text-gray-500'}`}>
                {getWordCount()} / 400 words
              </div>
              {errors.aboutYou && <span className="text-xs text-red-500 mt-1">{errors.aboutYou}</span>}
            </div>
          </div>

          {/* Resume Section */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Add Your Resume
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-[0.9375rem] text-gray-700 mb-1">
                {formData.resumeFile ? 'Click to change file' : 'Click to upload or drag and drop'}
              </div>
              <div className="text-xs text-gray-500">PDF files only (MAX. 10MB)</div>
            </div>

            {formData.resumeFile && (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md mt-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">{formData.resumeFile.name}</span>
                </div>
                <button type="button" onClick={handleRemoveFile} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                  Remove
                </button>
              </div>
            )}

            {errors.resumeFile && <span className="text-xs text-red-500 mt-1">{errors.resumeFile}</span>}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200 md:flex-row flex-col">
            <button type="button" onClick={handleCancel} className="px-5 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium transition-colors">
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