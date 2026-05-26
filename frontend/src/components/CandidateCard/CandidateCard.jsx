/**
 * CandidateCard.jsx — Individual candidate card component for employers
 *
 * Displays candidate information including profile picture, full name, location,
 * and resume link (if available).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function CandidateCard({ candidate }) {
  // Safely normalize resume URL (handles /uploads or uploads\ formats)
  const resumeUrl = candidate.resume_url
    ? `${API_BASE_URL}/${candidate.resume_url.replace(/^\/?uploads\//, 'uploads/')}`
    : null

  return (
    <article className="bg-white rounded-[14px] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-shadow cursor-pointer">

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
    </article>
  )
}

export default CandidateCard