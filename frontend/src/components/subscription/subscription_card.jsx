/**
 * SubscriptionCard - Pricing plan card component
 *
 * Features:
 * - Displays plan name, price, and list of benefits
 * - Action button varies based on current plan status
 * - Responsive design with Tailwind CSS
 */

/**
 * Checkmark icon component
 */
function CheckIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/**
 * SubscriptionCard component for displaying pricing plans
 *
 * @param {Object} props
 * @param {string} props.planName - Name of the plan (e.g., "Free", "Premium")
 * @param {string} props.price - Price display (e.g., "Free", "$9.99")
 * @param {string} props.period - Billing period (e.g., "/month", "/year")
 * @param {string} props.originalPrice - Original price for discount display (e.g., "$99.99")
 * @param {string} props.discountLabel - Discount label text (e.g., "Save 20%")
 * @param {string[]} props.benefits - Array of benefit descriptions
 * @param {boolean} props.isCurrentPlan - Whether this is the user's current plan
 * @param {boolean} props.isPopular - Whether to show "Most Popular" badge
 * @param {() => void} props.onAction - Callback when action button is clicked
 */
function SubscriptionCard({
  planName,
  price,
  period = '',
  originalPrice,
  discountLabel,
  benefits = [],
  isCurrentPlan = false,
  isPopular = false,
  onAction,
}) {
  const isFree = price.toLowerCase() === 'free'

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md ${
        isPopular
          ? 'border-blue-500 shadow-md'
          : 'border-gray-200'
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white">
          Cancel Anytime
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6 text-center">
        <h3 className="mb-2 text-xl font-bold text-slate-900">{planName}</h3>
        <div className="flex items-baseline justify-center gap-1">
          {originalPrice && (
            <span className="mr-2 text-xl text-slate-400 line-through decoration-slate-400">
              {originalPrice}
            </span>
          )}
          <span className="text-4xl font-extrabold text-slate-900">{price}</span>
          {period && <span className="text-lg text-slate-500">{period}</span>}
        </div>
        {discountLabel && (
          <div className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            {discountLabel}
          </div>
        )}
      </div>

      {/* Benefits list */}
      <ul className="mb-8 flex-1 space-y-4">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckIcon
              className={`mt-0.5 shrink-0 ${
                isPopular ? 'text-blue-600' : 'text-green-600'
              }`}
            />
            <span className="text-[0.95rem] text-slate-700">{benefit}</span>
          </li>
        ))}
      </ul>

      {/* Action button */}
      <button
        type="button"
        onClick={onAction}
        disabled={isCurrentPlan}
        className={`w-full rounded-xl py-3.5 text-base font-bold transition-all duration-200 ${
          isCurrentPlan
            ? 'cursor-default bg-gray-100 text-gray-500'
            : isPopular
              ? 'cursor-pointer bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200'
              : 'cursor-pointer border-2 border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        {isCurrentPlan ? 'Your Plan' : isFree ? 'Your Plan' : 'Upgrade'}
      </button>
    </div>
  )
}

export default SubscriptionCard
