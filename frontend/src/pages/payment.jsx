/**
 * Payment page - Checkout form for subscription upgrade
 *
 * Features:
 * - 70/30 layout: Payment form (left) + Order summary (right)
 * - Form validation (mock): Name must be text, Card must be numbers
 * - Payment modal: Success (green tick) or Failed (red X) based on validation
 * - Monthly/Annual toggle with dynamic pricing
 */
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import SwitchButton from '../components/Button/switch_button.jsx'

const BILLING_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annually', label: 'Annually' },
]

/**
 * Success icon component - Green checkmark
 */
function SuccessIcon() {
  return (
    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
      <svg
        className="h-10 w-10 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  )
}

/**
 * Error icon component - Red X
 */
function ErrorIcon() {
  return (
    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
      <svg
        className="h-10 w-10 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  )
}

/**
 * Payment Modal component
 */
function PaymentModal({ isOpen, isSuccess, message, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
        <h3
          className={`mb-2 text-2xl font-bold ${
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isSuccess ? 'Payment Successful' : 'Payment Failed'}
        </h3>
        <p className="mb-6 text-slate-600">{message}</p>
        <button
          onClick={onClose}
          className={`rounded-xl px-6 py-3 font-bold text-white transition-colors ${
            isSuccess
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Close
        </button>
      </div>
    </div>
  )
}

function Payment() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialPlan = searchParams.get('plan') || 'monthly'

  const [billingPeriod, setBillingPeriod] = useState(initialPlan)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cardNumber: '',
    cvc: '',
    expiry: '',
    address: '',
  })
  const [errors, setErrors] = useState({})
  const [modalState, setModalState] = useState({
    isOpen: false,
    isSuccess: false,
    message: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const isAnnually = billingPeriod === 'annually'
  const price = isAnnually ? '$79.00' : '$9.99'
  const period = isAnnually ? '/year' : '/month'
  const originalPrice = isAnnually ? '$99.99' : null

  /**
   * Handle billing period change and update URL
   */
  const handleBillingChange = (value) => {
    setBillingPeriod(value)
    setSearchParams({ plan: value })
  }

  /**
   * Validate form inputs
   * - Names: text only (letters and spaces)
   * - Card Number: numbers only
   * - CVC: 3-4 digits
   * - Expiry: MM/YY format
   * - Address: not empty
   */
  const validateForm = () => {
    const newErrors = {}

    // First Name: text only
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name must contain only letters'
    }

    // Last Name: text only
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name must contain only letters'
    }

    // Card Number: numbers only (13-19 digits)
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required'
    } else if (!/^\d+$/.test(formData.cardNumber)) {
      newErrors.cardNumber = 'Card number must contain only numbers'
    } else if (formData.cardNumber.length < 13 || formData.cardNumber.length > 19) {
      newErrors.cardNumber = 'Card number must be 13-19 digits'
    }

    // CVC: 3-4 digits
    if (!formData.cvc.trim()) {
      newErrors.cvc = 'CVC is required'
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC must be 3-4 digits'
    }

    // Expiry: MM/YY format
    if (!formData.expiry.trim()) {
      newErrors.expiry = 'Expiry date is required'
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Expiry must be in MM/YY format'
    }

    // Address: not empty
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    // Terms agreement
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle input changes with validation
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  /**
   * Handle payment submission (mock)
   */
  const handlePayNow = () => {
    const isValid = validateForm()

    if (isValid) {
      setModalState({
        isOpen: true,
        isSuccess: true,
        message: `Your ${isAnnually ? 'annual' : 'monthly'} Premium subscription has been activated successfully!`,
      })
    } else {
      setModalState({
        isOpen: true,
        isSuccess: false,
        message: 'Please fill in all required fields correctly.',
      })
    }
  }

  /**
   * Close modal and redirect if successful
   */
  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
    if (modalState.isSuccess) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={modalState.isOpen}
        isSuccess={modalState.isSuccess}
        message={modalState.message}
        onClose={handleCloseModal}
      />

      {/* Main content - 70/30 split */}
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left side - Payment Form (70%) */}
        <div className="flex-1 bg-white p-8 lg:w-[70%] lg:p-12">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-8 text-3xl font-bold text-slate-900">
              Payment Details
            </h1>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* First Name & Last Name */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className={`w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className={`w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Card Number */}
              <div>
                <label
                  htmlFor="cardNumber"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    errors.cardNumber
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                )}
              </div>

              {/* CVC & Expiry */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="cvc"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.cvc
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  {errors.cvc && (
                    <p className="mt-1 text-sm text-red-500">{errors.cvc}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="expiry"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiry"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      errors.expiry
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                  />
                  {errors.expiry && (
                    <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, City, Country"
                  rows={3}
                  className={`w-full rounded-lg border px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                    errors.address
                      ? 'border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handlePayNow}
                className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>

        {/* Right side - Order Summary (30%) */}
        <div className="bg-blue-600 p-8 text-white lg:w-[30%] lg:p-12">
          <div className="mx-auto max-w-sm lg:mx-0">
            <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

            {/* Subscription type toggle */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-blue-100">
                Subscription Type
              </label>
              <div className="rounded-full bg-blue-700 p-1">
                <SwitchButton
                  options={BILLING_OPTIONS}
                  value={billingPeriod}
                  onChange={handleBillingChange}
                  ariaLabel="Select subscription type"
                />
              </div>
            </div>

            {/* Price display */}
            <div className="mb-8 rounded-xl bg-blue-700 p-6">
              <div className="mb-2 flex items-baseline gap-2">
                {originalPrice && (
                  <span className="text-xl text-blue-300 line-through">
                    {originalPrice}
                  </span>
                )}
                <span className="text-4xl font-extrabold">{price}</span>
              </div>
              <p className="text-blue-200">{period}</p>
              {isAnnually && (
                <div className="mt-3 inline-block rounded-full bg-green-500 px-3 py-1 text-sm font-semibold">
                  Save 20%
                </div>
              )}
            </div>

            {/* Features included */}
            <div className="mb-8 space-y-3">
              <h3 className="font-semibold text-blue-100">Premium includes:</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  AI-powered job recommendations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority application status
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Featured profile for recruiters
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Direct messaging with recruiters
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Resume review and optimization
                </li>
              </ul>
            </div>

            {/* Terms checkbox */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked)
                    if (errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: undefined }))
                    }
                  }}
                  className="mt-1 h-5 w-5 rounded border-blue-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-blue-100">
                  I agree to the{' '}
                  <a href="/terms" className="underline hover:text-white">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="underline hover:text-white">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-2 text-sm text-red-300">{errors.terms}</p>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-blue-500 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">{price}</span>
              </div>
              <p className="mt-1 text-right text-sm text-blue-200">{period}</p>
            </div>

            {/* Cancel note */}
            <p className="mt-8 text-center text-sm text-blue-200">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Payment
