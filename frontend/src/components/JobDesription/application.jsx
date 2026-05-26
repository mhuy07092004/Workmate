/**
 * application.jsx — Job Application page
 *
 * Route: /job/:id/application
 * Candidate-only: redirects employers and unauthenticated visitors back to
 * the job detail page.
 *
 * Sections:
 *   1. Job title header (reuses JobTitle component)
 *   2. CV selection — use saved CV or upload a new one
 *   3. Cover letter textarea
 *   4. Submit / Cancel actions
 */
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import JobTitle from './JobTitle.jsx'
import { normalizeApiJob } from '../../services/jobStore.js'
import { getCurrentUserRole } from '../../services/userService.js'
import {
  submitApplication,
  fetchUserApplications,
  getSavedResume,
  saveResumeMetadata,
} from '../../services/applicationStore.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function JobApplication() {
  const { id } = useParams()
  const navigate = useNavigate()
  const role = getCurrentUserRole()

  const [job, setJob] = useState(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [jobError, setJobError] = useState('')

  const savedResume = getSavedResume()
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  const [cvMode, setCvMode] = useState(savedResume ? 'saved' : 'upload')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [errors, setErrors] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!savedResume && cvMode === 'saved') setCvMode('upload')
  }, [savedResume, cvMode])

  useEffect(() => {
    let cancelled = false
    const loadJob = async () => {
      try {
        setLoadingJob(true)
        setJobError('')
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.detail || data.error || 'Job not found')
        }
        if (!cancelled) setJob(normalizeApiJob(data.job))
      } catch (err) {
        if (!cancelled) setJobError(err.message)
      } finally {
        if (!cancelled) setLoadingJob(false)
      }
    }
    loadJob()
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    fetchUserApplications()
      .then(apps => {
        if (!cancelled) {
          setAlreadyApplied(apps.some(a => String(a.job_id) === String(id)))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [id])

  // Guard — only candidates can access this page
  if (role !== 'candidate') {
    return <Navigate to={`/job/${id}`} replace />
  }

  if (loadingJob) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">Loading job...</main>
        <Footer />
      </div>
    )
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-red-500">
          {jobError || 'Job not found'}
        </main>
        <Footer />
      </div>
    )
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, cv: 'Please upload a PDF file only' }))
      return
    }
    setErrors(prev => ({ ...prev, cv: '' }))
    setUploadedFile(file)
    saveResumeMetadata({ fileName: file.name, uploadedAt: new Date().toISOString() })
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = () => {
    const next = {}
    if (cvMode === 'upload' && !uploadedFile) next.cv = 'Please upload your CV (PDF)'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      setSubmitting(true)
      await submitApplication({ jobId: id })
      setShowSuccessModal(true)
    } catch (err) {
      setErrors(prev => ({ ...prev, submit: err.message || 'Failed to submit application' }))
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseSuccess = () => {
    setShowSuccessModal(false)
    navigate(`/job/${id}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-8">
        {/* Job header */}
        <JobTitle
          title={job.title}
          company={job.company}
          postedDate={job.postedDate}
        />

        {alreadyApplied && (
          <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
            You have already applied for this job. You can submit again to update your application.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">

          {/* Section A — CV */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Your CV / Resume
            </h2>

            {/* Radio options */}
            <div className="flex flex-col gap-3 mb-4">
              <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${cvMode === 'saved' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'} ${!savedResume ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name="cvMode"
                  value="saved"
                  checked={cvMode === 'saved'}
                  disabled={!savedResume}
                  onChange={() => setCvMode('saved')}
                  className="mt-0.5 accent-blue-600"
                />
                <div>
                  <div className="font-medium text-slate-800 text-sm">Use saved CV</div>
                  {savedResume ? (
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {savedResume.fileName}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 mt-0.5">No CV saved on your profile</div>
                  )}
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${cvMode === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input
                  type="radio"
                  name="cvMode"
                  value="upload"
                  checked={cvMode === 'upload'}
                  onChange={() => setCvMode('upload')}
                  className="mt-0.5 accent-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-800 text-sm">Upload new CV</div>
                  <div className="text-xs text-slate-500 mt-0.5">PDF files only (MAX. 10MB)</div>
                </div>
              </label>
            </div>

            {/* Upload zone — shown only when upload mode is active */}
            {cvMode === 'upload' && (
              <>
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
                  <svg className="w-10 h-10 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="text-sm text-gray-700 mb-1">
                    {uploadedFile ? 'Click to change file' : 'Click to upload or drag and drop'}
                  </div>
                  <div className="text-xs text-gray-500">PDF files only (MAX. 10MB)</div>
                </div>

                {uploadedFile && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md mt-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700 font-medium">{uploadedFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </>
            )}

            {errors.cv && <p className="text-xs text-red-500 mt-2">{errors.cv}</p>}
          </div>

          {/* Section B — Cover Letter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Cover Letter
            </h2>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              placeholder="Introduce yourself, explain why you're a great fit for this role, and highlight your most relevant experience..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            />
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500">{errors.submit}</p>
          )}

          {/* Section C — Actions */}
          <div className="flex gap-3 justify-end pb-4">
            <button
              type="button"
              onClick={() => navigate(`/job/${id}`)}
              className="cursor-pointer px-6 py-3 rounded-full border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer px-8 py-3 rounded-full bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

        </form>
      </main>

      <Footer />

      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-8 text-center">
            <button
              type="button"
              aria-label="Close"
              onClick={handleCloseSuccess}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
            <p className="text-slate-500 text-sm mb-6">Your application has been sent to the employer.</p>

            <button
              type="button"
              onClick={handleCloseSuccess}
              className="cursor-pointer w-full px-6 py-2.5 rounded-full border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobApplication
