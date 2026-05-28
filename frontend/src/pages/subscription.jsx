/**
 * Subscription page - Pricing plans and upgrade options
 *
 * Features:
 * - Monthly/Annually toggle using SwitchButton
 * - Free and Premium pricing cards
 * - Responsive layout with Navbar and Footer
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import SwitchButton from '../components/Button/switch_button.jsx'
import SubscriptionCard from '../components/subscription/subscription_card.jsx'

const BILLING_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
]

const FREE_BENEFITS = [
  'Basic job search and filtering',
  'Create and manage your profile',
  'Apply to job listings',
  'View company profiles',
  'Save jobs for later',
  'Email support',
]

const PREMIUM_BENEFITS = [
  'Everything in Free, plus:',
  'AI-powered job recommendations',
  'Priority application status',
  'Featured profile for recruiters',
  'Resume review and optimization',
  'Direct messaging with recruiters',
  'Salary insights and market data',
  'Priority customer support',
]

function Subscription() {
  const [billingPeriod, setBillingPeriod] = useState('monthly')
  const navigate = useNavigate()

  const isAnnually = billingPeriod === 'annually'
  const premiumPrice = isAnnually ? '$79' : '$9.99'
  const premiumPeriod = isAnnually ? '/year' : '/month'
  const originalPrice = isAnnually ? '$99.99' : null
  const discountLabel = isAnnually ? 'Save 20%' : null

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Main content */}
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header section */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-slate-900">
              Upgrade Now To Receive Countless Benefits
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Choose the plan that fits your career goals and unlock powerful features to accelerate your professional journey.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="mx-auto mb-12 max-w-xs">
            <SwitchButton
              options={BILLING_OPTIONS}
              value={billingPeriod}
              onChange={setBillingPeriod}
              ariaLabel="Select billing period"
            />
          </div>

          {/* Pricing cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <SubscriptionCard
              planName="Free"
              price="Free"
              benefits={FREE_BENEFITS}
              isCurrentPlan={true}
              onAction={() => {}}
            />

            {/* Premium Plan */}
            <SubscriptionCard
              planName="Premium"
              price={premiumPrice}
              period={premiumPeriod}
              originalPrice={originalPrice}
              discountLabel={discountLabel}
              benefits={PREMIUM_BENEFITS}
              isCurrentPlan={false}
              isPopular={true}
              onAction={() => {
                navigate(`/payment?plan=${billingPeriod}`)
              }}
            />
          </div>

          {/* Additional info */}
          <p className="mt-8 text-center text-sm text-slate-500">
            All plans include secure data handling and can be cancelled at any time.{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              View our privacy policy
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Subscription
