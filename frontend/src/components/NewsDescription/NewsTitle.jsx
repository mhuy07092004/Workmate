/**
 * NewsTitle.jsx — News headline and metadata component
 *
 * Props:
 *   - title: string — News headline/title
 *   - company: string — Company name
 *   - postedBy: string — Name of user who posted the news
 *   - postedDate: string — ISO date string or formatted date
 */

function NewsTitle({ title, company, postedBy, postedDate }) {
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
      {/* News headline */}
      <h1 className="text-[2rem] font-bold text-slate-900 leading-tight mb-6">
        {title}
      </h1>

      {/* Posted metadata */}
      <div className="flex items-center gap-3">
        {/* Company logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-xl">
          {company?.charAt(0) || 'N'}
        </div>

        <div className="flex flex-col">
          <span className="text-[1rem] font-semibold text-slate-900">
            {postedBy}
          </span>
          <span className="text-[0.9rem] text-slate-500">
            {company} · Posted on {formatDate(postedDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default NewsTitle
