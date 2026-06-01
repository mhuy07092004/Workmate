/**
 * JobCard.jsx — Individual job recommendation card component
 *
 * Displays job information including company logo, job title, employment type,
 * location, and posting time. Uses consistent styling with the dashboard design.
 */
import { Link } from 'react-router-dom'
import SaveJob from '../Button/SaveJob.jsx'

function JobCard({ job, isSaved: _isSaved = false, onSave = () => { } }) {
  const employmentLabel = job.employmentType || job.type
  const arrangementLabel =
    job.workArrangement && job.workArrangement !== job.employmentType
      ? job.workArrangement
      : null

  const _handleSaveClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onSave(job.id)
  }

  return (
    <article className="relative bg-white rounded-[14px] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-shadow">
      <Link to={`/job/${job.id}`} className="no-underline block">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-lg">
            {job.company?.charAt(0) || 'J'}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="mb-1 text-[1.1rem] font-semibold text-slate-900 leading-tight">
              {job.title}
            </h3>
            <p className="mb-2 text-[0.95rem] text-slate-600 font-medium">
              {job.company}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[0.875rem]">
              {employmentLabel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-blue-700 font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  {employmentLabel}
                </span>
              )}
              {arrangementLabel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600 font-medium">
                  {arrangementLabel}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-slate-500">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {job.location}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[0.8rem] text-slate-400">{job.postedTime}</p>
          {job.salary && (
            <span className="text-[0.8rem] font-semibold text-slate-600">{job.salary}</span>
          )}
        </div>
      </Link>
    </article>
  )
}

export default JobCard