/**
 * NewsCard.jsx — Individual hiring news card component
 *
 * Displays hiring news including headline, company name, and posting time.
 * Uses consistent styling with the dashboard design system.
 */

function NewsCard({ news }) {
  return (
    <article className="bg-white rounded-[14px] p-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-shadow cursor-pointer border-l-4 border-blue-500">
      {/* News headline */}
      <h3 className="mb-3 text-[1.1rem] font-semibold text-slate-900 leading-tight">
        {news.headline}
      </h3>
      
      {/* News metadata */}
      <div className="flex items-center justify-between text-[0.875rem] text-slate-500">
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          posted by {news.company}
        </span>
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {news.postedTime}
        </span>
      </div>
    </article>
  )
}

export default NewsCard
