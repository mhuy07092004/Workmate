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
import {
  EMPLOYMENT_TYPES,
  WORK_ARRANGEMENTS,
  EDUCATION_LEVELS,
  normalizePostedJob,
  appendPostedJob,
} from '../services/jobStore.js'

function PostJob() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    companyInfo: '',
    jobDescription: '',
    educationLevel: '',
    requiredSkills: '',
    yearsOfExperience: '',
    employmentType: '',
    workArrangement: WORK_ARRANGEMENTS[0],
    jobLocation: '',
    salary: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required'
    } else if (formData.jobDescription.length < 50) {
      newErrors.jobDescription = 'Job description must be at least 50 characters'
    }

    if (!formData.employmentType) {
      newErrors.employmentType = 'Employment type is required'
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
      // TODO (backend integration): Replace with POST /api/jobs
      const job = normalizePostedJob(formData)
      appendPostedJob(job)

      setFormData({
        jobTitle: '',
        companyName: '',
        companyInfo: '',
        jobDescription: '',
        educationLevel: '',
        requiredSkills: '',
        yearsOfExperience: '',
        employmentType: '',
        workArrangement: WORK_ARRANGEMENTS[0],
        jobLocation: '',
        salary: '',
      })
      setSuccessMessage(`"${job.title}" has been posted successfully!`)
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Error posting job:', error)
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

          {successMessage && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {successMessage}
            </div>
          )}

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

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="e.g. Tech Solutions Inc."
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>

            {/* Company Information (tagline / about) */}
            <div>
              <label htmlFor="companyInfo" className="block text-sm font-medium text-slate-700 mb-2">
                Company Description
              </label>
              <input
                type="text"
                id="companyInfo"
                name="companyInfo"
                value={formData.companyInfo}
                onChange={handleInputChange}
                className="w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                placeholder="e.g. Leading software development company specialising in fintech"
              />
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

            {/* Employment Type + Education Level — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-slate-700 mb-2">
                  Employment Type *
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                    errors.employmentType ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                >
                  <option value="">Select type</option>
                  {EMPLOYMENT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.employmentType && (
                  <p className="mt-1 text-sm text-red-600">{errors.employmentType}</p>
                )}
              </div>

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
                  {EDUCATION_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.educationLevel && (
                  <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
                )}
              </div>
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

            {/* Work Arrangement */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Work Arrangement *
              </label>
              <div className="flex flex-wrap gap-4">
                {WORK_ARRANGEMENTS.map(arrangement => (
                  <label key={arrangement} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="workArrangement"
                      value={arrangement}
                      checked={formData.workArrangement === arrangement}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-slate-900">{arrangement}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range (optional) */}
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-slate-700 mb-2">
                Salary Range <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                placeholder="e.g. $80k - $100k"
              />
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