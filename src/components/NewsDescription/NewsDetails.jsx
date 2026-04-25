/**
 * NewsDetails.jsx — News article content with image component
 *
 * Props:
 *   - content: string — The main news article content
 *   - image?: string — URL to the news image (optional)
 */

function NewsDetails({ content, image }) {
  return (
    <div className="bg-white rounded-[14px] p-8 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
      {/* Featured Image */}
      {image && (
        <div className="mb-8">
          <img
            src={image}
            alt="News featured image"
            className="w-full h-[400px] object-cover rounded-[12px]"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="text-slate-700 leading-relaxed text-[1.05rem] whitespace-pre-line">
        {content}
      </div>
    </div>
  )
}

export default NewsDetails
