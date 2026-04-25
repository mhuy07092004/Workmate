/**
 * post_job.jsx — Job posting page for employers
 *
 * Allows employers to create and post new job listings with comprehensive
 * job details including title, company info, description, requirements,
 * and work preferences.
 *
 * Features:
 * - Complete job posting form with validation
 * - Responsive design matching existing UI patterns
 * - Proper error handling and user feedback
 * - Integration with existing navbar and footer
 */
import { useState } from 'react'
import Footer from '../components/Footer/Footer.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'

function PostJob() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyInfo: '',
    jobDescription: '',
    educationLevel: '',
    requiredSkills: '',
    yearsOfExperience: '',
    workMode: 'remote',
    jobLocation: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const educationLevels = [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'No specific education required'
  ]

  const workModes = [
    { value: 'remote', label: 'Remote' },
    { value: 'on-site', label: 'On-site' },
    { value: 'hybrid', label: 'Hybrid' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required'
    }

    if (!formData.companyInfo.trim()) {
      newErrors.companyInfo = 'Company information is required'
    }

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required'
    } else if (formData.jobDescription.length < 50) {
      newErrors.jobDescription = 'Job description must be at least 50 characters'
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = 'Education level is required'
    }

    if (!formData.requiredSkills.trim()) {
      newErrors.requiredSkills = 'Required skills are required'
    }

    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = 'Years of experience is required'
    } else if (isNaN(formData.yearsOfExperience) || formData.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = 'Please enter a valid number'
    }

    if (!formData.jobLocation.trim()) {
      newErrors.jobLocation = 'Job location is required'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call
      console.log('Submitting job posting:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset form on success
      setFormData({
        jobTitle: '',
        companyInfo: '',
        jobDescription: '',
        educationLevel: '',
        requiredSkills: '',
        yearsOfExperience: '',
        workMode: 'remote',
        jobLocation: ''
      })
      
      alert('Job posted successfully!')
    } catch (error) {
      console.error('Error posting job:', error)
      alert('Failed to post job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-8">
        <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
          <h1 className="mb-2.5 text-[1.6rem] text-slate-900">Post a New Job</h1>
          <p className="mb-8 text-slate-600 leading-relaxed">
            Fill in the details below to create a new job posting and reach qualified candidates.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.jobTitle ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="e.g. Senior Frontend Developer"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
              )}
            </div>

            {/* Company Information */}
            <div>
              <label htmlFor="companyInfo" className="block text-sm font-medium text-slate-700 mb-2">
                Company Information *
              </label>
              <input
                type="text"
                id="companyInfo"
                name="companyInfo"
                value={formData.companyInfo}
                onChange={handleInputChange}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.companyInfo ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="e.g. Tech Solutions Inc. - Leading software development company"
              />
              {errors.companyInfo && (
                <p className="mt-1 text-sm text-red-600">{errors.companyInfo}</p>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-slate-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                rows={6}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-vertical ${
                  errors.jobDescription ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for in a candidate..."
              />
              {errors.jobDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.jobDescription}</p>
              )}
            </div>

            {/* Required Education Level */}
            <div>
              <label htmlFor="educationLevel" className="block text-sm font-medium text-slate-700 mb-2">
                Required Education Level *
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.educationLevel ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
              >
                <option value="">Select education level</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              {errors.educationLevel && (
                <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
              )}
            </div>

            {/* Required Skills */}
            <div>
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-slate-700 mb-2">
                Required Skills *
              </label>
              <input
                type="text"
                id="requiredSkills"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleInputChange}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.requiredSkills ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="e.g. JavaScript, React, Node.js, MongoDB (comma separated)"
              />
              {errors.requiredSkills && (
                <p className="mt-1 text-sm text-red-600">{errors.requiredSkills}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-slate-700 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                min="0"
                max="50"
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.yearsOfExperience ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="e.g. 3"
              />
              {errors.yearsOfExperience && (
                <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>
              )}
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Work Mode *
              </label>
              <div className="space-y-2">
                {workModes.map(mode => (
                  <label key={mode.value} className="flex items-center">
                    <input
                      type="radio"
                      name="workMode"
                      value={mode.value}
                      checked={formData.workMode === mode.value}
                      onChange={handleInputChange}
                      className="mr-2 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-slate-900">{mode.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Location */}
            <div>
              <label htmlFor="jobLocation" className="block text-sm font-medium text-slate-700 mb-2">
                Job Location *
              </label>
              <input
                type="text"
                id="jobLocation"
                name="jobLocation"
                value={formData.jobLocation}
                onChange={handleInputChange}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.jobLocation ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="e.g. Sydney, NSW or Remote (if applicable)"
              />
              {errors.jobLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.jobLocation}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg border-0 cursor-pointer transition-colors duration-150 hover:bg-blue-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-700"
              >
                {isSubmitting ? 'Posting Job...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PostJob