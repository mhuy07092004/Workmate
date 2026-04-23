/**
 * PostCard.jsx — Social media style post display component
 *
 * Displays a post with user info, text content, and optional image.
 * Similar to Threads or Facebook post cards.
 */

function PostCard({ post }) {
  return (
    <article className="bg-white rounded-[14px] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.12)] transition-shadow">
      {/* User info header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
          {post.author.charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="text-[0.95rem] font-semibold text-slate-900 leading-tight">
            {post.author}
          </h4>
          <span className="text-[0.8rem] text-slate-500">
            {post.timestamp}
          </span>
        </div>
      </div>

      {/* Post content */}
      <p className="text-[0.95rem] text-slate-700 leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Optional image */}
      {post.image && (
        <div className="mb-4">
          <img
            src={post.image}
            alt="Post attachment"
            className="w-full rounded-[10px] object-cover max-h-[400px]"
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
        <button className="flex items-center gap-2 text-[0.85rem] text-slate-500 hover:text-blue-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {post.likes || 0}
        </button>
        <button className="flex items-center gap-2 text-[0.85rem] text-slate-500 hover:text-blue-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          {post.comments || 0}
        </button>
        <button className="flex items-center gap-2 text-[0.85rem] text-slate-500 hover:text-blue-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16,6 12,2 8,6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          Share
        </button>
      </div>
    </article>
  )
}

export default PostCard
