import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'

const EMPLOYMENT_TYPES = ['Full-time', 'Contract', 'Remote', 'Hybrid']
const WORK_ARRANGEMENTS = ['On-site', 'Remote', 'Hybrid']
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getAuthToken() {
  return localStorage.getItem('workmate_token')
}

function getUserId() {
  return localStorage.getItem('workmate_user_id')
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

function PostJob() {
  const navigate = useNavigate()
  const userId = getUserId()

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    job_type: '',
    work_arrangement: 'Hybrid',
    salary_range: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target
    if (value.split(/\s+/).filter(w => w.length > 0).length <= 1000) {
      setFormData(prev => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const handleRequirementsChange = (e) => {
    const { name, value } = e.target
    if (value.split(/\s+/).filter(w => w.length > 0).length <= 500) {
      setFormData(prev => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'Job title is required'
    }

    if (!formData.company?.trim()) {
      newErrors.company = 'Company name is required'
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Job description is required'
    } else if (formData.description.split(/\s+/).filter(w => w.length > 0).length > 1000) {
      newErrors.description = 'Description exceeds maximum length (1000 words)'
    }

    if (!formData.requirements?.trim()) {
      newErrors.requirements = 'Requirements are required'
    } else if (formData.requirements.split(/\s+/).filter(w => w.length > 0).length > 500) {
      newErrors.requirements = 'Requirements exceed maximum length (500 words)'
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!formData.job_type?.trim()) {
      newErrors.job_type = 'Employment type is required'
    }

    if (!formData.work_arrangement?.trim()) {
      newErrors.work_arrangement = 'Work arrangement is required'
    }

    if (formData.salary_range?.trim()) {
      const salaryMatch = formData.salary_range.match(/^(\d+)\s*-\s*(\d+)/)
      if (!salaryMatch) {
        newErrors.salary_range = 'Salary must be in format: 50000-100000'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const parseSalaryRange = (salaryStr) => {
    if (!salaryStr?.trim()) {
      return { salary_min: 0, salary_max: 0 }
    }

    const match = salaryStr.match(/^(\d+)\s*-\s*(\d+)/)
    if (match) {
      return {
        salary_min: parseInt(match[1]),
        salary_max: parseInt(match[2]),
      }
    }

    return { salary_min: 0, salary_max: 0 }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setErrors({})

      const salaryData = parseSalaryRange(formData.salary_range)

      const jobData = {
        user_id: Number(userId),
        title: formData.title,
        company: formData.company,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        job_type: formData.job_type,
        work_arrangement: formData.work_arrangement,
        salary_min: salaryData.salary_min,
        salary_max: salaryData.salary_max,
      }

      const response = await fetchFromAPI('/jobs/', 'POST', jobData)

      if (response.job) {
        setSuccessMessage('Job posted successfully!')
        setFormData({
          title: '',
          company: '',
          description: '',
          requirements: '',
          location: '',
          job_type: '',
          work_arrangement: 'Hybrid',
          salary_range: '',
        })

        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (err) {
      console.error('Error posting job:', err)
      setErrors({ form: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDescriptionWordCount = () =>
    formData.description.trim().split(/\s+/).filter(w => w.length > 0).length

  const getRequirementsWordCount = () =>
    formData.requirements.trim().split(/\s+/).filter(w => w.length > 0).length

  const inputClass = (err) =>
    `w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${err ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
    }`

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-8">
        <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
          <h1 className="mb-2.5 text-[1.6rem] text-slate-900">Post a New Job</h1>
          <p className="mb-8 text-slate-600 leading-relaxed">
            Fill in the details below to create a new job posting and reach qualified candidates.
          </p>

          {errors.form && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errors.form}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={inputClass(errors.title)}
                placeholder="e.g. Senior Software Engineer"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className={inputClass(errors.company)}
                placeholder="e.g. Tech Solutions Inc."
              />
              {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleDescriptionChange}
                rows={8}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-vertical ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for in a candidate..."
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {getDescriptionWordCount()} / 1000 words
              </div>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-slate-700 mb-2">
                Requirements & Skills *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleRequirementsChange}
                rows={6}
                className={`w-full rounded-lg border-[1.5px] border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-vertical ${errors.requirements ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                placeholder="List required skills, experience, certifications, qualifications, and any other requirements..."
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {getRequirementsWordCount()} / 500 words
              </div>
              {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
            </div>

            {/* Location & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={inputClass(errors.location)}
                  placeholder="e.g. Sydney, NSW or Remote"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label htmlFor="job_type" className="block text-sm font-medium text-slate-700 mb-2">
                  Employment Type *
                </label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleInputChange}
                  className={`${inputClass(errors.job_type)} bg-white`}
                >
                  <option value="">Select employment type</option>
                  {EMPLOYMENT_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.job_type && <p className="mt-1 text-sm text-red-600">{errors.job_type}</p>}
              </div>
            </div>

            {/* Work Arrangement & Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="work_arrangement" className="block text-sm font-medium text-slate-700 mb-2">
                  Work Arrangement *
                </label>
                <select
                  id="work_arrangement"
                  name="work_arrangement"
                  value={formData.work_arrangement}
                  onChange={handleInputChange}
                  className={`${inputClass(errors.work_arrangement)} bg-white`}
                >
                  {WORK_ARRANGEMENTS.map(arr => (
                    <option key={arr} value={arr}>
                      {arr}
                    </option>
                  ))}
                </select>
                {errors.work_arrangement && <p className="mt-1 text-sm text-red-600">{errors.work_arrangement}</p>}
              </div>

              <div>
                <label htmlFor="salary_range" className="block text-sm font-medium text-slate-700 mb-2">
                  Salary Range <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="salary_range"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleInputChange}
                  className={inputClass(errors.salary_range)}
                  placeholder="e.g. 80000-120000"
                />
                <p className="text-xs text-gray-500 mt-1">Format: min-max (e.g., 80000-120000)</p>
                {errors.salary_range && <p className="mt-1 text-sm text-red-600">{errors.salary_range}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg border-0 cursor-pointer transition-colors duration-150 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg border-0 cursor-pointer transition-colors duration-150 hover:bg-blue-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-700"
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