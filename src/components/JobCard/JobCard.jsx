/**
 * JobCard.jsx — Individual job recommendation card component
 *
 * Displays job information including company logo, job title, employment type,
 * location, and posting time. Uses consistent styling with the dashboard design.
 */

function JobCard({ job }) {
  return (
    <article className="bg-white rounded-[14px] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-shadow cursor-pointer">
      {/* Company logo and job info */}
      <div className="flex items-start gap-4">
        {/* Company logo placeholder */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold text-lg">
          {job.company.charAt(0)}
        </div>
        
        {/* Job details */}
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-[1.1rem] font-semibold text-slate-900 leading-tight">
            {job.title}
          </h3>
          <p className="mb-2 text-[0.95rem] text-slate-600 font-medium">
            {job.company}
          </p>
          
          {/* Employment type and location */}
          <div className="flex flex-wrap items-center gap-3 text-[0.875rem] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              {job.type}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {job.location}
            </span>
          </div>
        </div>
      </div>
      
      {/* Posted time */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-[0.8rem] text-slate-400">
          {job.postedTime}
        </p>
      </div>
    </article>
  )
}

export default JobCard
