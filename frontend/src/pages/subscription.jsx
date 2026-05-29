/**
 * Subscription page - Pricing plans and upgrade options
 *
 * Features:
 * - Monthly/Annually toggle using SwitchButton
 * - Free and Premium pricing cards
 * - Fetches and displays current user subscription
 * - Handles subscription creation on backend
 * - Allows downgrade from Premium to Free
 * - Responsive layout with Navbar and Footer
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import SwitchButton from '../components/Button/switch_button.jsx'
import SubscriptionCard from '../components/subscription/subscription_card.jsx'
import { getCurrentUserId } from '../services/userService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [fetchingSubscription, setFetchingSubscription] = useState(true)
  const navigate = useNavigate()

  const isAnnually = billingPeriod === 'annually'
  const premiumPrice = isAnnually ? '$79' : '$9.99'
  const premiumPeriod = isAnnually ? '/year' : '/month'
  const originalPrice = isAnnually ? '$99.99' : null
  const discountLabel = isAnnually ? 'Save 20%' : null

  // Fetch current subscription on page load
  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      try {
        const userId = getCurrentUserId()

        if (!userId) {
          setCurrentSubscription(null)
          setFetchingSubscription(false)
          return
        }

        const response = await fetch(
          `${API_BASE_URL}/subscriptions/user/${userId}`
        )

        if (response.ok) {
          const data = await response.json()
          setCurrentSubscription(data.subscription)
          // Set billing period to match current subscription
          if (data.subscription?.billing_period) {
            setBillingPeriod(data.subscription.billing_period)
          }
        } else {
          // No subscription found, user is on free tier
          setCurrentSubscription(null)
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err)
        setCurrentSubscription(null)
      } finally {
        setFetchingSubscription(false)
      }
    }

    fetchCurrentSubscription()
  }, [])

  const handlePremiumUpgrade = async () => {
    setLoading(true)
    setError(null)

    try {
      const userId = getCurrentUserId()

      if (!userId) {
        setError('Please log in to upgrade to Premium')
        setLoading(false)
        navigate('/login')
        return
      }

      // Create subscription on backend
      const response = await fetch(`${API_BASE_URL}/subscriptions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('workmate_token')}`,
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
          tier: 'premium',
          billing_period: billingPeriod,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || 'Failed to create subscription'
        )
      }

      // Subscription created successfully, update state and navigate to payment
      setCurrentSubscription(data.subscription)
      navigate(`/payment?plan=${billingPeriod}&subscription_id=${data.subscription.id}`)
    } catch (err) {
      console.error('Subscription error:', err)
      setError(err.message || 'Failed to process upgrade. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDowngradeToFree = async () => {
    setLoading(true)
    setError(null)

    try {
      const userId = getCurrentUserId()

      if (!userId) {
        setError('Please log in to downgrade your plan')
        setLoading(false)
        return
      }

      // Cancel subscription on backend (downgrade to free)
      const response = await fetch(`${API_BASE_URL}/subscriptions/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('workmate_token')}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || data.detail || 'Failed to downgrade subscription'
        )
      }

      // Subscription cancelled successfully, update state
      setCurrentSubscription(null)
      setError(null)
    } catch (err) {
      console.error('Downgrade error:', err)
      setError(err.message || 'Failed to process downgrade. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isCurrentlyPremium = currentSubscription?.tier === 'premium'
  const isCurrentlyFree = !currentSubscription || currentSubscription?.tier === 'free'

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

            {/* Current plan status */}
            {!fetchingSubscription && (
              <p className="mt-4 text-sm text-slate-500">
                {isCurrentlyPremium ? (
                  <span className="font-semibold text-blue-600">
                    You are currently on the Premium plan ({currentSubscription.billing_period})
                  </span>
                ) : (
                  <span className="font-semibold text-slate-700">
                    You are currently on the Free plan
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Billing toggle */}
          {!isCurrentlyPremium && (
            <div className="mx-auto mb-12 max-w-xs">
              <SwitchButton
                options={BILLING_OPTIONS}
                value={billingPeriod}
                onChange={setBillingPeriod}
                ariaLabel="Select billing period"
                disabled={loading}
              />
            </div>
          )}

          {/* Pricing cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <SubscriptionCard
              planName="Free"
              price="Free"
              benefits={FREE_BENEFITS}
              isCurrentPlan={isCurrentlyFree && !fetchingSubscription}
              onAction={isCurrentlyPremium ? handleDowngradeToFree : () => { }}
              disabled={loading}
              loading={loading && isCurrentlyPremium}
              buttonText={isCurrentlyPremium ? 'Downgrade to Free' : undefined}
            />

            {/* Premium Plan */}
            <SubscriptionCard
              planName="Premium"
              price={premiumPrice}
              period={premiumPeriod}
              originalPrice={originalPrice}
              discountLabel={discountLabel}
              benefits={PREMIUM_BENEFITS}
              isCurrentPlan={isCurrentlyPremium && !fetchingSubscription}
              isPopular={true}
              onAction={isCurrentlyPremium ? () => { } : handlePremiumUpgrade}
              disabled={loading || isCurrentlyPremium}
              loading={loading && !isCurrentlyPremium}
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