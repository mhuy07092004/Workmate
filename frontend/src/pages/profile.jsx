import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import ProfilePictureCard from '../components/ProfilePictureCard/ProfilePictureCard.jsx'

const MAX_EXPERIENCE_ENTRIES = 10
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function newExperienceEntry() {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    position: '',
    company_name: '',
    from_date: '',
    until_date: '',
    is_currently_working: false,
  }
}

function getCurrentUserEmail() {
  return localStorage.getItem('workmate_current_user_email')
}

function getCurrentUserID() {
  return localStorage.getItem('workmate_user_id')
}

function getCurrentUserRole() {
  return localStorage.getItem('workmate_user_role')
}

function getAuthToken() {
  return localStorage.getItem('workmate_token')
}

async function fetchFromAPI(endpoint, method = 'GET', body = null) {
  const token = getAuthToken()
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || data.error || 'API Error')
  }
  return data
}

// ── Candidate Profile ────────────────────────────────────────────────────────

function CandidateProfile() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    education_level: '',
    major: '',
    school: '',
    about_you: '',
    skills: '',
    preferred_working_mode: 'Hybrid',
    preferred_location: '',
    resume_file: null,
    profile_picture_file: null,
  })

  const [experiences, setExperiences] = useState([newExperienceEntry()])
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] = useState(null)
  const [errors, setErrors] = useState({})
  const [experienceErrors, setExperienceErrors] = useState([])
  const [profilePictureError, setProfilePictureError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resumeUrl, setResumeUrl] = useState(null)

  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const userId = getCurrentUserID()

  useEffect(() => {
    if (!formData.profile_picture_file) {
      setProfilePicturePreviewUrl(null)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => setProfilePicturePreviewUrl(e.target.result)
    reader.readAsDataURL(formData.profile_picture_file)
  }, [formData.profile_picture_file])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAboutYouChange = (e) => {
    const { name, value } = e.target
    if (value.split(/\s+/).filter(w => w.length > 0).length <= 400) {
      setFormData(prev => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, resume_file: 'Only PDF files are allowed' }))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resume_file: 'File size must be less than 10MB' }))
      return
    }

    setFormData(prev => ({ ...prev, resume_file: file }))
    if (errors.resume_file) {
      setErrors(prev => ({ ...prev, resume_file: '' }))
    }
  }

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, resume_file: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleProfilePictureChange = (file, error) => {
    if (error) {
      setProfilePictureError(error)
    } else {
      setFormData(prev => ({ ...prev, profile_picture_file: file }))
      setProfilePictureError('')
    }
  }

  const handleProfilePictureRemove = () => {
    setFormData(prev => ({ ...prev, profile_picture_file: null }))
    setProfilePicturePreviewUrl(null)
  }

  const updateExperience = (index, patch) => {
    setExperiences(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], ...patch }
      return updated
    })
  }

  const handleExperienceFieldChange = (index, e) => {
    const { name, value, type, checked } = e.target
    updateExperience(index, {
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const addExperience = () => {
    if (experiences.length < MAX_EXPERIENCE_ENTRIES) {
      setExperiences(prev => [...prev, newExperienceEntry()])
    }
  }

  const removeExperience = (index) => {
    if (experiences.length > 1) {
      setExperiences(prev => prev.filter((_, i) => i !== index))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is not valid'
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.education_level?.trim()) {
      newErrors.education_level = 'Education level is required'
    }

    if (!formData.major?.trim()) {
      newErrors.major = 'Major/field of study is required'
    }

    if (!formData.school?.trim()) {
      newErrors.school = 'School name is required'
    }

    if (!formData.about_you?.trim()) {
      newErrors.about_you = 'About you is required'
    }

    if (!formData.skills?.trim()) {
      newErrors.skills = 'Skills are required'
    }

    if (!formData.preferred_location?.trim()) {
      newErrors.preferred_location = 'Preferred location is required'
    }

    const expErrors = experiences.map((exp, idx) => {
      const expErr = {}
      if (!exp.position?.trim()) expErr.position = 'Position is required'
      if (!exp.company_name?.trim()) expErr.company_name = 'Company name is required'
      if (!exp.from_date?.trim()) expErr.from_date = 'Start date is required'
      if (!exp.is_currently_working && !exp.until_date?.trim()) {
        expErr.until_date = 'End date is required'
      }
      return expErr
    })

    if (expErrors.some(err => Object.keys(err).length > 0)) {
      setExperienceErrors(expErrors)
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && !expErrors.some(err => Object.keys(err).length > 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      setErrors({})

      // Prepare profile data
      const profileData = {
        user_id: Number(userId),
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        education_level: formData.education_level,
        major: formData.major,
        school: formData.school,
        about_you: formData.about_you,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        preferred_working_mode: formData.preferred_working_mode,
        preferred_location: formData.preferred_location,
        experiences: experiences.map(exp => ({
          position: exp.position,
          company_name: exp.company_name,
          from_date: exp.from_date,
          until_date: exp.until_date,
          is_currently_working: exp.is_currently_working,
        })),
      }

      // Check if profile exists
      let profileResponse
      try {
        const existingProfile = await fetchFromAPI(`/profiles/${userId}`)
        // Profile exists — UPDATE it (PUT)
        profileResponse = await fetchFromAPI(`/profiles/${userId}`, 'PUT', profileData)
      } catch (err) {
        // Profile doesn't exist — CREATE it (POST)
        if (err.message.includes('404') || err.message.includes('not found')) {
          profileResponse = await fetchFromAPI('/profiles/', 'POST', profileData)
        } else {
          throw err
        }
      }

      // Upload files if present
      if (formData.resume_file || formData.profile_picture_file) {
        const formDataForUpload = new FormData()
        if (formData.resume_file) {
          formDataForUpload.append('resume', formData.resume_file)
        }
        if (formData.profile_picture_file) {
          formDataForUpload.append('profile_picture', formData.profile_picture_file)
        }

        const token = getAuthToken()
        const uploadResponse = await fetch(`${API_BASE_URL}/profiles/upload/${userId}`, {
          method: 'POST',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: formDataForUpload,
        })

        if (!uploadResponse.ok) {
          throw new Error('File upload failed')
        }
      }

      setErrors({})
      alert('Profile saved successfully!')
      await loadUserData()
    } catch (err) {
      console.error('Error saving profile:', err)
      setErrors({ form: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserData = async () => {
    try {
      if (!userId) return

      const response = await fetchFromAPI(`/profiles/${userId}`)

      if (response.profile) {
        const profile = response.profile
        setFormData({
          full_name: profile.full_name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          education_level: profile.education_level || '',
          major: profile.major || '',
          school: profile.school || '',
          about_you: profile.about_you || '',
          skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '',
          preferred_working_mode: profile.preferred_working_mode || 'Hybrid',
          preferred_location: profile.preferred_location || '',
          resume_file: null,
          profile_picture_file: null,
        })

        if (profile.resume_url) {
          const url = profile.resume_url.startsWith('http')
            ? profile.resume_url
            : `${API_BASE_URL}/${profile.resume_url.replace(/^\//, '')}`
          setResumeUrl(url)
        }

        if (Array.isArray(profile.experiences) && profile.experiences.length > 0) {
          setExperiences(
            profile.experiences.map((exp, idx) => ({
              id: `${Date.now()}-${idx}`,
              position: exp.position || '',
              company_name: exp.company_name || '',
              from_date: exp.from_date || '',
              until_date: exp.until_date || '',
              is_currently_working: exp.is_currently_working || false,
            }))
          )
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [userId])

  const getWordCount = () =>
    formData.about_you.trim().split(/\s+/).filter(w => w.length > 0).length

  const getCharCounterClass = () => {
    const count = getWordCount()
    if (count > 380) return 'error'
    if (count > 350) return 'warning'
    return 'normal'
  }

  const inputClass = (err) =>
    `px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${err ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <ProfilePictureCard
            fullName={formData.full_name}
            file={formData.profile_picture_file}
            previewUrl={profilePicturePreviewUrl}
            onFileChange={handleProfilePictureChange}
            onRemove={handleProfilePictureRemove}
            error={profilePictureError}
          />

          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col col-span-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={inputClass(errors.full_name)}
                  placeholder="Enter your full name"
                />
                {errors.full_name && <span className="text-xs text-red-500 mt-1">{errors.full_name}</span>}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                  Email Address
                </label>
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
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass(errors.phone)}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <span className="text-xs text-red-500 mt-1">{errors.phone}</span>}
              </div>
            </div>
          </div>

          {/* Education */}
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
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                  Education Level
                </label>
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleInputChange}
                  className={`${inputClass(errors.education_level)} bg-white`}
                >
                  <option value="">Select education level</option>
                  <option value="High School">High School</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Other">Other</option>
                </select>
                {errors.education_level && <span className="text-xs text-red-500 mt-1">{errors.education_level}</span>}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                  Major/Field of Study
                </label>
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
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                  School
                </label>
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

          {/* Experience */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Experience
              </h2>
              <span className="text-xs text-slate-400">
                {experiences.length} / {MAX_EXPERIENCE_ENTRIES}
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mb-4">
                    <div className="flex flex-col col-span-1 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                        Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={exp.position}
                        onChange={(e) => handleExperienceFieldChange(index, e)}
                        className={inputClass(experienceErrors[index]?.position)}
                        placeholder="e.g., Software Developer"
                      />
                      {experienceErrors[index]?.position && (
                        <span className="text-xs text-red-500 mt-1">{experienceErrors[index].position}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={exp.company_name}
                        onChange={(e) => handleExperienceFieldChange(index, e)}
                        className={inputClass(experienceErrors[index]?.company_name)}
                        placeholder="e.g., Tech Company Inc"
                      />
                      {experienceErrors[index]?.company_name && (
                        <span className="text-xs text-red-500 mt-1">{experienceErrors[index].company_name}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="from_date"
                        value={exp.from_date}
                        onChange={(e) => handleExperienceFieldChange(index, e)}
                        className={inputClass(experienceErrors[index]?.from_date)}
                      />
                      {experienceErrors[index]?.from_date && (
                        <span className="text-xs text-red-500 mt-1">{experienceErrors[index].from_date}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="until_date"
                        value={exp.until_date}
                        onChange={(e) => handleExperienceFieldChange(index, e)}
                        disabled={exp.is_currently_working}
                        className={inputClass(experienceErrors[index]?.until_date)}
                      />
                      {experienceErrors[index]?.until_date && (
                        <span className="text-xs text-red-500 mt-1">{experienceErrors[index].until_date}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_currently_working"
                      checked={exp.is_currently_working}
                      onChange={(e) => handleExperienceFieldChange(index, e)}
                      className="rounded"
                    />
                    <label className="text-sm text-gray-700">I currently work here</label>
                  </div>

                  {experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="mt-4 text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      Remove Experience
                    </button>
                  )}
                </div>
              ))}
            </div>

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
              <p className="mt-4 text-xs text-slate-400">
                Maximum of {MAX_EXPERIENCE_ENTRIES} experience entries reached.
              </p>
            )}
          </div>

          {/* Skills (NEW - 2ND SUBMISSION) */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Skills
            </h2>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                Your Skills
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className={inputClass(errors.skills)}
                placeholder="e.g., JavaScript, React, Python, SQL (comma separated)"
              />
              <p className="text-xs text-gray-500 mt-1">Enter skills separated by commas</p>
              {errors.skills && <span className="text-xs text-red-500 mt-1">{errors.skills}</span>}
            </div>
          </div>

          {/* Work Preferences (NEW - 2ND SUBMISSION) */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Work Preferences
            </h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                  Preferred Working Mode
                </label>
                <select
                  name="preferred_working_mode"
                  value={formData.preferred_working_mode}
                  onChange={handleInputChange}
                  className={`${inputClass(errors.preferred_working_mode)} bg-white`}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
                {errors.preferred_working_mode && (
                  <span className="text-xs text-red-500 mt-1">{errors.preferred_working_mode}</span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                  Preferred Location
                </label>
                <input
                  type="text"
                  name="preferred_location"
                  value={formData.preferred_location}
                  onChange={handleInputChange}
                  className={inputClass(errors.preferred_location)}
                  placeholder="e.g., Sydney, Melbourne, Remote"
                />
                {errors.preferred_location && (
                  <span className="text-xs text-red-500 mt-1">{errors.preferred_location}</span>
                )}
              </div>
            </div>
          </div>

          {/* About You */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About You
            </h2>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1.5 after:content-['_*'] after:text-red-500">
                Tell us about yourself
              </label>
              <textarea
                name="about_you"
                value={formData.about_you}
                onChange={handleAboutYouChange}
                className={`px-3 py-2.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y min-h-[120px] ${errors.about_you ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Share your professional background, skills, and career goals..."
                rows="6"
              />
              <div
                className={`text-right text-xs mt-1 ${getCharCounterClass() === 'error'
                    ? 'text-red-500'
                    : getCharCounterClass() === 'warning'
                      ? 'text-amber-500'
                      : 'text-gray-500'
                  }`}
              >
                {getWordCount()} / 400 words
              </div>
              {errors.about_you && <span className="text-xs text-red-500 mt-1">{errors.about_you}</span>}
            </div>
          </div>

          {/* Resume Upload */}
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
                {formData.resume_file ? 'Click to change file' : 'Click to upload or drag and drop'}
              </div>
              <div className="text-xs text-gray-500">PDF files only (MAX. 10MB)</div>
            </div>
            {resumeUrl && (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md mt-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline font-medium">
                    View Saved Resume
                  </a>
                </div>
              </div>
            )}
            {formData.resume_file && (
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md mt-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">{formData.resume_file.name}</span>
                </div>
                <button type="button" onClick={handleRemoveFile} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                  Remove
                </button>
              </div>
            )}
            {errors.resume_file && <span className="text-xs text-red-500 mt-1 block">{errors.resume_file}</span>}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200 md:flex-row flex-col">
            <button
              type="button"
              onClick={loadUserData}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}

export default CandidateProfile