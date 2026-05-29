/**
 * CandidateCard.jsx — Individual candidate card component for employers
 *
 * Displays candidate information including profile picture, full name, location,
 * resume link, and status management for employers.
 */
import { useState } from 'react'
import { updateApplicationStatus, getStatusColor, getStatusLabel } from '../../services/applicationStatusService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function CandidateCard({
  candidate,
  isEmployerView = false,
  onStatusChange = null
}) {
  const [status, setStatus] = useState(candidate.application_status || candidate.status || null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)

  // Safely normalize resume URL
  const resumeUrl = candidate.resume_url
    ? `${API_BASE_URL}/${candidate.resume_url.replace(/^\/?uploads\//, 'uploads/')}`
    : null

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value

    if (!candidate.application_id) {
      setError('Cannot update status: application not found')
      return
    }

    try {
      setIsUpdating(true)
      setError(null)

      await updateApplicationStatus(candidate.application_id, newStatus)
      setStatus(newStatus)

      if (onStatusChange) {
        onStatusChange(candidate.id || candidate.userId, newStatus)
      }
    } catch (err) {
      setError(err.message)
      console.error('Failed to update status:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <article className="bg-white rounded-[14px] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-shadow">

      {/* Profile + Info */}
      <div className="flex flex-col items-center text-center">

        {/* Avatar */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-2xl mb-4">
          {candidate.fullName?.charAt(0) || "?"}
        </div>

        {/* Name */}
        <h3 className="mb-2 text-[1.1rem] font-semibold text-slate-900 leading-tight">
          {candidate.fullName}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-[0.875rem] text-slate-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {candidate.location || "Unknown location"}
        </div>

        {/* Job applied */}
        <div className="mt-2 flex items-center gap-1 text-[0.875rem] text-blue-600 font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z" />
          </svg>
          {candidate.jobApplied || "Software Engineer Intern"}
        </div>
      </div>

      {/* Resume link */}
      {resumeUrl && (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm text-blue-600 hover:underline"
        >
          View Resume
        </a>
      )}

      {/* Status Section for Employers */}
      {isEmployerView && candidate.application_id && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Application Status
          </label>

          {error && (
            <div className="mb-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <select
            value={status || ''}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`w-full px-3 py-2 text-sm rounded-lg border border-slate-300 
              focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none
              ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${getStatusColor(status)}`}
          >
            <option value="">No status</option>
            <option value="applied">Applied</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlist">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>

          {status && (
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(status)} text-center`}>
              {getStatusLabel(status)}
            </div>
          )}
        </div>
      )}

      {/* Status Badge for Candidates */}
      {!isEmployerView && status && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className={`px-3 py-2 rounded-lg text-sm font-medium text-center border ${getStatusColor(status)}`}>
            Status: {getStatusLabel(status)}
          </div>
        </div>
      )}
    </article>
  )
}

export default CandidateCard