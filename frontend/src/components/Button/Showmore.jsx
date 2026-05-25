/**
 * Showmore.jsx — Reusable Show More / Show Less buttons
 *
 * Props:
 *   - visibleCount: number of currently visible items
 *   - totalCount: total number of items available
 *   - initialCount: initial number of items to show (default: 6)
 *   - itemName: name of the items (default: "Jobs") — used in button text
 *   - onShowMore: callback when "Show More" is clicked
 *   - onShowLess: callback when "Show Less" is clicked
 */

function Showmore({
  visibleCount,
  totalCount,
  initialCount = 6,
  itemName = "Jobs",
  onShowMore,
  onShowLess
}) {
  const canShowMore = visibleCount < totalCount
  const canShowLess = visibleCount > initialCount

  if (!canShowMore && !canShowLess) return null

  return (
    <div className="flex justify-center gap-3">
      {canShowMore && (
        <button
          onClick={onShowMore}
          className="cursor-pointer rounded-full border-0 bg-blue-700 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-blue-600 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
        >
          Show More {itemName}
        </button>
      )}
      {canShowLess && (
        <button
          onClick={onShowLess}
          className="cursor-pointer rounded-full border-0 bg-slate-600 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-slate-700 hover:shadow-[0_4px_14px_rgba(71,85,105,0.3)]"
        >
          Show Less {itemName}
        </button>
      )}
    </div>
  )
}

export default Showmore
