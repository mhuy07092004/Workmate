/**
 * SaveJob.jsx — Save job button component
 *
 * Props:
 *   - onClick: function — Callback when button is clicked
 *   - disabled: boolean — Whether button is disabled
 */

/**
 * SaveJob.jsx — Save job button component
 *
 * Props:
 *   - onClick: function — Callback when button is clicked
 *   - disabled: boolean — Whether button is disabled
 *   - isSaved: boolean — Whether the job is already saved
 */

function SaveJob({ onClick, disabled = false, isSaved = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all ${isSaved
          ? 'bg-slate-900 text-white hover:bg-slate-800'
          : 'bg-green-600 text-white hover:bg-green-500'
        } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isSaved ? 'Saved' : 'Save Job'}
    </button>
  )
}

export default SaveJob