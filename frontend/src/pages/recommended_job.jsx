/**
 * recommended_job.jsx — AI Recommended Jobs page (candidate view)
 *
 * Features:
 *   - AI-powered job recommendations based on resume similarity
 *   - Top-K jobs ranked by match score
 *   - Membership tier enforcement (Free: 10, Premium: Unlimited)
 *   - Simple, clean display
 *
 * Note: Search and filtering moved to dashboard.jsx
 */

import { useState, useEffect } from 'react'

import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Contact from '../components/Contact/Contact.jsx'
import JobCard from '../components/JobCard/JobCard.jsx'
import Showmore from '../components/Button/Showmore.jsx'

import { normalizeApiJob } from '../services/jobStore.js'
import { getCurrentUserId } from '../services/userService.js'
import { getUserSubscriptionTier } from '../services/subscriptionService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getAuthToken() {
  return localStorage.getItem('workmate_token')
}

/**
 * Generic API fetch helper
 */
async function fetchFromAPI(endpoint) {
  const token = getAuthToken()

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || data.error || 'API Error'
    )
  }

  return data
}

function RecommendedJob() {
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(6)
  const [subscriptionTier, setSubscriptionTier] = useState(null)

  // ─────────────────────────────────────────────────────────
  // LOAD: AI-Recommended Jobs
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      setLoading(true)
      setError('')

      try {
        const userId = getCurrentUserId()

        if (!userId) {
          setError('No current user ID found. Log in to get recommendations.')
          setRecommendedJobs([])
          setLoading(false)
          return
        }

        // Get subscription tier for limit
        const { limit, tier } = await getUserSubscriptionTier(
          parseInt(userId, 10)
        )
        setSubscriptionTier(tier)

        // Fetch AI recommendations
        const response = await fetchFromAPI(
          `/candidates/recommended-jobs/${parseInt(userId, 10)}?limit=${limit}`
        )

        const normalized = (response.jobs || []).map(normalizeApiJob)
        setRecommendedJobs(normalized)
      } catch (err) {
        console.error('Error loading recommended jobs:', err)
        setError(err.message || 'Unable to load recommended jobs')
        setRecommendedJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedJobs()
  }, [])

  const displayedJobs = recommendedJobs.slice(0, visibleCount)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
        <Contact />

        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
            <h1 className="mb-2.5 text-[1.6rem] text-slate-900 font-semibold">
              AI-Recommended Jobs For You
            </h1>
            <p className="text-slate-600 leading-relaxed">
              Based on your resume and profile, here are the top jobs that match your
              qualifications and interests. These recommendations are powered by AI
              matching technology.
            </p>
            {subscriptionTier && (
              <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
                📊 Subscription Tier: <span className="font-semibold capitalize">{subscriptionTier}</span>
              </div>
            )}
          </section>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
              <p className="text-slate-600">Loading your personalized recommendations...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
              <p className="text-red-700 font-semibold mb-2">Unable to Load Recommendations</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && recommendedJobs.length === 0 && (
            <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
              <p className="text-slate-600">
                No jobs match your profile yet. Try completing your profile or checking back later.
              </p>
            </div>
          )}

          {/* Jobs Grid */}
          {!loading && !error && recommendedJobs.length > 0 && (
            <>
              <div>
                <div className="mb-6">
                  <h2 className="text-[1.2rem] font-semibold text-slate-900">
                    Top {Math.min(visibleCount, recommendedJobs.length)} of{' '}
                    {recommendedJobs.length} Matches
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Click on any job to view details and apply
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                  {displayedJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {recommendedJobs.length > 6 && (
                  <Showmore
                    visibleCount={visibleCount}
                    totalCount={recommendedJobs.length}
                    initialCount={6}
                    onShowMore={() =>
                      setVisibleCount(prev =>
                        Math.min(prev + 6, recommendedJobs.length)
                      )
                    }
                    onShowLess={() => setVisibleCount(6)}
                  />
                )}
              </div>
            </>
          )}
        </div>

        <div className="w-[240px] shrink-0 hidden xl:block" />
      </main>

      <Footer />
    </div>
  )
}

export default RecommendedJob