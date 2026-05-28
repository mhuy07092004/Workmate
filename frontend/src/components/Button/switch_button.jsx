/**
 * SwitchButton - A reusable animated tab switcher component
 *
 * Features:
 * - Two-option toggle with sliding background animation
 * - Accessible with ARIA attributes
 * - Smooth transition effects
 */

/**
 * @typedef {Object} SwitchOption
 * @property {string} value - The value identifier for this option
 * @property {string} label - The display label for this option
 */

/**
 * SwitchButton component for toggling between two options
 *
 * @param {Object} props
 * @param {SwitchOption[]} props.options - Array of exactly two options
 * @param {string} props.value - Currently selected value
 * @param {(value: string) => void} props.onChange - Callback when selection changes
 * @param {string} props.ariaLabel - Accessibility label for the control
 */
function SwitchButton({ options, value, onChange, ariaLabel }) {
  if (!options || options.length !== 2) {
    console.warn('SwitchButton requires exactly 2 options')
    return null
  }

  const [leftOption, rightOption] = options
  const isLeftSelected = value === leftOption.value

  return (
    <div
      className="rounded-full bg-gray-200 p-1 grid grid-cols-2 gap-1.5 relative"
      role="tablist"
      aria-label={ariaLabel}
    >
      {/* Animated sliding background */}
      <div
        className="absolute top-1 bottom-1 bg-white rounded-full shadow-[0_2px_12px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out pointer-events-none"
        style={{
          width: 'calc(50% - 6px)',
          left: isLeftSelected ? '4px' : 'calc(50% + 2px)',
        }}
      />

      {/* Left option button */}
      <button
        type="button"
        role="tab"
        aria-selected={isLeftSelected}
        className={`relative z-10 border-0 rounded-full text-base font-bold py-2.5 bg-transparent cursor-pointer transition-colors duration-300 ${
          isLeftSelected
            ? 'text-slate-900'
            : 'text-slate-700 hover:text-slate-900'
        }`}
        onClick={() => onChange(leftOption.value)}
      >
        {leftOption.label}
      </button>

      {/* Right option button */}
      <button
        type="button"
        role="tab"
        aria-selected={!isLeftSelected}
        className={`relative z-10 border-0 rounded-full text-base font-bold py-2.5 bg-transparent cursor-pointer transition-colors duration-300 ${
          !isLeftSelected
            ? 'text-slate-900'
            : 'text-slate-700 hover:text-slate-900'
        }`}
        onClick={() => onChange(rightOption.value)}
      >
        {rightOption.label}
      </button>
    </div>
  )
}

export default SwitchButton
