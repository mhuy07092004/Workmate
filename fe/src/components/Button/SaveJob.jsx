/**
 * SaveJob.jsx — Save job button component
 *
 * Props:
 *   - onClick: function — Callback when button is clicked
 *   - disabled: boolean — Whether button is disabled
 */

function SaveJob({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded-full border-0 bg-green-600 px-8 py-3 text-[1rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-green-500 hover:shadow-[0_4px_14px_rgba(22,163,74,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 disabled:hover:shadow-none"
    >
      Save Job
    </button>
  )
}

export default SaveJob
