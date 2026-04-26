/**
 * JobTitle.jsx — Job title and date posted component
 *
 * Props:
 *   - title: string — Job title
 *   - postedDate: string — ISO date string or formatted date
 *   - company: string — Company name
 */

function JobTitle({ title, postedDate, company }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-[14px] p-8 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
      <div className="flex items-start gap-4">
        {/* Company logo placeholder */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-2xl">
          {company?.charAt(0) || 'C'}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-[1.75rem] font-bold text-slate-900 leading-tight mb-2">
            {title}
          </h1>
          <p className="text-[1.1rem] text-slate-600 font-medium mb-1">
            {company}
          </p>
          <p className="text-[0.9rem] text-slate-500">
            Posted on {formatDate(postedDate)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default JobTitle
