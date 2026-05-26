/**
 * ApplyJob.jsx — Apply for job button component
 *
 * Props:
 *   - onClick: function — Callback when button is clicked
 *   - disabled: boolean — Whether button is disabled
 */

function ApplyJob({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer rounded-full border-0 bg-blue-700 px-8 py-3 text-[1rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-blue-600 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-700 disabled:hover:shadow-none`}
    >
      Apply Now
    </button>
  )
}

export default ApplyJob
