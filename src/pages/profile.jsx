import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import ProfilePictureCard from '../components/ProfilePictureCard/ProfilePictureCard.jsx'
import { getCurrentUserEmail, findUserByEmail } from '../services/userService.js'

const MAX_EXPERIENCE_ENTRIES = 10

function newExperienceEntry() {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    position: '',
    companyName: '',
    fromDate: '',
    untilDate: '',
    isCurrentlyWorking: false,
  }
}

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

    // About You
    aboutYou: '',

    // Resume
    resumeFile: null,

    // Profile picture
    profilePictureFile: null,
  })

  const [experiences, setExperiences] = useState([newExperienceEntry()])
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] = useState(null)
  const [errors, setErrors] = useState({})
  const [experienceErrors, setExperienceErrors] = useState([])
  const [profilePictureError, setProfilePictureError] = useState('')
  const fileInputRef = useRef(null)

  // Revoke preview URL on file change / unmount to avoid memory leaks
  useEffect(() => {
    let url = null
    if (formData.profilePictureFile) {
      url = URL.createObjectURL(formData.profilePictureFile)
      setProfilePicturePreviewUrl(url)
    } else {
      setProfilePicturePreviewUrl(null)
    }
    return () => { if (url) URL.revokeObjectURL(url) }
  }, [formData.profilePictureFile])

  // ── Personal / Education / About handlers ──────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleAboutYouChange = (e) => {
    const text = e.target.value
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length
    if (wordCount <= 400) {
      setFormData(prev => ({ ...prev, aboutYou: text }))
      if (errors.aboutYou) setErrors(prev => ({ ...prev, aboutYou: '' }))
    }
  }

  // ── Resume handlers ─────────────────────────────────────────────────────────

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, resumeFile: file }))
      if (errors.resumeFile) setErrors(prev => ({ ...prev, resumeFile: '' }))
    } else {
      setErrors(prev => ({ ...prev, resumeFile: 'Please upload a PDF file only' }))
    }
  }

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, resumeFile: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Profile picture handlers ─────────────────────────────────────────────────

  const handleProfilePictureChange = (file, error) => {
    setProfilePictureError(error || '')
    setFormData(prev => ({ ...prev, profilePictureFile: file }))
  }

  const handleProfilePictureRemove = () => {
    setProfilePictureError('')
    setFormData(prev => ({ ...prev, profilePictureFile: null }))
  }

  // ── Experience handlers ──────────────────────────────────────────────────────

  const updateExperience = (index, patch) => {
    setExperiences(prev => prev.map((exp, i) => i === index ? { ...exp, ...patch } : exp))
    if (experienceErrors[index]) {
      setExperienceErrors(prev => {
        const next = [...prev]
        next[index] = { ...next[index], ...Object.fromEntries(Object.keys(patch).map(k => [k, ''])) }
        return next
      })
    }
  }

  const handleExperienceFieldChange = (index, e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'isCurrentlyWorking') {
      updateExperience(index, { isCurrentlyWorking: checked, untilDate: checked ? '' : experiences[index].untilDate })
    } else {
      updateExperience(index, { [name]: value })
    }
  }

  const addExperience = () => {
    if (experiences.length >= MAX_EXPERIENCE_ENTRIES) return
    setExperiences(prev => [...prev, newExperienceEntry()])
    setExperienceErrors(prev => [...prev, {}])
  }

  const removeExperience = (index) => {
    if (experiences.length <= 1) return
    setExperiences(prev => prev.filter((_, i) => i !== index))
    setExperienceErrors(prev => prev.filter((_, i) => i !== index))
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'

    if (!formData.educationLevel) newErrors.educationLevel = 'Education level is required'
    if (!formData.major.trim()) newErrors.major = 'Major is required'
    if (!formData.school.trim()) newErrors.school = 'School is required'

    // Per-entry experience validation
    const newExpErrors = experiences.map((exp) => {
      const e = {}
      if (!exp.position.trim()) e.position = 'Position is required'
      if (!exp.companyName.trim()) e.companyName = 'Company name is required'
      if (!exp.fromDate) e.fromDate = 'From date is required'
      if (!exp.isCurrentlyWorking && !exp.untilDate) e.untilDate = 'Until date is required'
      return e
    })

    setErrors(newErrors)
    setExperienceErrors(newExpErrors)

    const expValid = newExpErrors.every(e => Object.keys(e).length === 0)
    return Object.keys(newErrors).length === 0 && expValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Profile save disabled - backend integration required
      alert('Profile save feature requires backend integration. Changes will not be persisted.')
    }
  }

  const handleCancel = () => {
    loadUserData()
  }

  // ── Load user data ───────────────────────────────────────────────────────────

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
          aboutYou: user.about || '',
          resumeFile: null,
          profilePictureFile: null,
        })

        // Normalise experiences: prefer user.experiences[] if present, else fall back to flat fields
        if (Array.isArray(user.experiences) && user.experiences.length > 0) {
          setExperiences(user.experiences.map(exp => ({
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
            position: exp.position || '',
            companyName: exp.companyName || '',
            fromDate: exp.from || '',
            untilDate: exp.until === 'present' ? '' : exp.until || '',
            isCurrentlyWorking: exp.until === 'present',
          })))
        } else {
          setExperiences([{
            id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
            position: user.position || '',
            companyName: user.companyName || '',
            fromDate: user.from || '',
            untilDate: user.until === 'present' ? '' : user.until || '',
            isCurrentlyWorking: user.until === 'present',
          }])
        }

        setExperienceErrors([])
        setProfilePictureError('')
      }
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getWordCount = () =>
    formData.aboutYou.trim().split(/\s+/).filter(w => w.length > 0).length

  const getCharCounterClass = () => {
    const wc = getWordCount()
    if (wc >= 400) return 'error'
    if (wc >= 350) return 'warning'
    return ''
  }

  const inputClass = (err) =>
    `px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${err ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Profile</h1>
          <p className="text-base text-slate-500">Manage your personal information and professional details</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Profile Picture Section */}
          <ProfilePictureCard
            fullName={formData.fullName}
            file={formData.profilePictureFile}
            previewUrl={profilePicturePreviewUrl}
            onFileChange={handleProfilePictureChange}
            onRemove={handleProfilePictureRemove}
            error={profilePictureError}
          />

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
                  className={inputClass(errors.fullName)}
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
                  className={inputClass(errors.email)}
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
                  className={inputClass(errors.phoneNumber)}
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
                  className={`${inputClass(errors.educationLevel)} bg-white`}
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
                  className={inputClass(errors.major)}
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
                  className={inputClass(errors.school)}
                  placeholder="e.g., University of California"
                />
                {errors.school && <span className="text-xs text-red-500 mt-1">{errors.school}</span>}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Experience
              </h2>
              <span className="text-xs text-slate-400">{experiences.length} / {MAX_EXPERIENCE_ENTRIES}</span>
            </div>

            <div className="flex flex-col gap-6">
              {experiences.map((exp, index) => {
                const expErr = experienceErrors[index] || {}
                return (
                  <div key={exp.id} className="relative rounded-lg border border-slate-200 p-4 bg-slate-50">
                    {/* Entry header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-slate-600">
                        Experience {index + 1}
                        {exp.position && ` — ${exp.position}`}
                      </span>
                      {experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Position</label>
                        <input
                          type="text"
                          name="position"
                          value={exp.position}
                          onChange={(e) => handleExperienceFieldChange(index, e)}
                          className={inputClass(expErr.position)}
                          placeholder="e.g., Software Engineer"
                        />
                        {expErr.position && <span className="text-xs text-red-500 mt-1">{expErr.position}</span>}
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          value={exp.companyName}
                          onChange={(e) => handleExperienceFieldChange(index, e)}
                          className={inputClass(expErr.companyName)}
                          placeholder="e.g., Tech Company Inc."
                        />
                        {expErr.companyName && <span className="text-xs text-red-500 mt-1">{expErr.companyName}</span>}
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">From</label>
                        <input
                          type="date"
                          name="fromDate"
                          value={exp.fromDate}
                          onChange={(e) => handleExperienceFieldChange(index, e)}
                          className={inputClass(expErr.fromDate)}
                        />
                        {expErr.fromDate && <span className="text-xs text-red-500 mt-1">{expErr.fromDate}</span>}
                      </div>

                      <div className="flex flex-col">
                        <label className={`text-sm font-medium mb-1.5 after:content-['_*'] after:text-red-500 ${exp.isCurrentlyWorking ? 'text-gray-400' : 'text-gray-700'}`}>Until</label>
                        <input
                          type="date"
                          name="untilDate"
                          value={exp.untilDate}
                          onChange={(e) => handleExperienceFieldChange(index, e)}
                          disabled={exp.isCurrentlyWorking}
                          className={`${inputClass(expErr.untilDate)} disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
                        />
                        {expErr.untilDate && <span className="text-xs text-red-500 mt-1">{expErr.untilDate}</span>}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            id={`currently-working-${exp.id}`}
                            name="isCurrentlyWorking"
                            checked={exp.isCurrentlyWorking}
                            onChange={(e) => handleExperienceFieldChange(index, e)}
                            className="w-4 h-4 accent-blue-500"
                          />
                          <label htmlFor={`currently-working-${exp.id}`} className="text-sm text-gray-700 cursor-pointer">
                            Currently working here
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add experience button */}
            {experiences.length < MAX_EXPERIENCE_ENTRIES && (
              <button
                type="button"
                onClick={addExperience}
                className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add another experience
              </button>
            )}
            {experiences.length >= MAX_EXPERIENCE_ENTRIES && (
              <p className="mt-4 text-xs text-slate-400">Maximum of {MAX_EXPERIENCE_ENTRIES} experience entries reached.</p>
            )}
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
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
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

            {errors.resumeFile && <span className="text-xs text-red-500 mt-1 block">{errors.resumeFile}</span>}
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
