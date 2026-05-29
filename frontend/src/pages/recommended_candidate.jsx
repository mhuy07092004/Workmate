/**
 * recommended_candidate.jsx — AI Recommended Candidates page (employer view)
 *
 * Features:
 *   - AI-powered candidate recommendations for selected job
 *   - Top-N candidates ranked by resume-job match score
 *   - Membership tier enforcement (Free: 10, Premium: Unlimited)
 *   - Job selector dropdown to view recommendations for different jobs
 *   - Simple, clean display
 *
 * Note: Search and filtering moved to dashboard.jsx
 */

import { useState, useEffect } from 'react'

import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Contact from '../components/Contact/Contact.jsx'
import CandidateCard from '../components/CandidateCard/CandidateCard.jsx'
import Showmore from '../components/Button/Showmore.jsx'

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

function RecommendedCandidate() {
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [recommendedCandidates, setRecommendedCandidates] = useState([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [error, setError] = useState('')
  const [subscriptionTier, setSubscriptionTier] = useState(null)

  const userId = getCurrentUserId()
  const employerId = userId ? Number(userId) : null

  // ─────────────────────────────────────────────────────────
  // LOAD: Employer's Posted Jobs
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true)
        setError('')

        if (!employerId) {
          setError('No employer ID found.')
          setJobs([])
          return
        }

        const data = await fetchFromAPI('/jobs')
        const allJobs = data.jobs || []

        // Filter to only employer's jobs
        const employerJobs = allJobs.filter(
          job => Number(job.user_id) === employerId
        )

        setJobs(employerJobs)

        // Select first job by default
        if (employerJobs.length > 0) {
          setSelectedJobId(employerJobs[0].id)
        }
      } catch (err) {
        console.error('Error loading jobs:', err)
        setError(err.message)
        setJobs([])
      } finally {
        setLoadingJobs(false)
      }
    }

    fetchJobs()
  }, [employerId])

  // ─────────────────────────────────────────────────────────
  // LOAD: AI-Recommended Candidates for Selected Job
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedJobId) return

    const fetchCandidates = async () => {
      try {
        setLoadingCandidates(true)
        setError('')

        // Get subscription tier for limit
        const { limit, tier } = await getUserSubscriptionTier(employerId)
        setSubscriptionTier(tier)

        // Fetch AI recommendations
        const data = await fetchFromAPI(
          `/recommendations/candidates?job_id=${selectedJobId}&limit=${limit}`
        )

        setRecommendedCandidates(data.candidates || [])
      } catch (err) {
        console.error('Error loading candidates:', err)
        setError(err.message)
        setRecommendedCandidates([])
      } finally {
        setLoadingCandidates(false)
      }
    }

    fetchCandidates()
  }, [selectedJobId, employerId])

  const selectedJob = jobs.find(job => job.id === selectedJobId)
  const displayedCandidates = recommendedCandidates.slice(0, visibleCount)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
        <Contact />

        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Header with Job Selector */}
          <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <h1 className="mb-2.5 text-[1.6rem] text-slate-900 font-semibold">
                  AI-Recommended Candidates
                </h1>
                <p className="text-slate-600 leading-relaxed">
                  Top candidates selected based on job description and requirements. These
                  recommendations use AI to match candidate skills with your job posting.
                </p>
              </div>

              {/* Job Selector */}
              {jobs.length > 0 && (
                <div className="w-full max-w-sm">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Job
                  </label>
                  <select
                    value={selectedJobId ?? ''}
                    onChange={e => setSelectedJobId(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="" disabled>
                      Select a job...
                    </option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                        {job.location ? ` • ${job.location}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Selected Job Info */}
            {selectedJob && (
              <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span className="font-semibold">Recommendations for:</span> {selectedJob.title}
                {selectedJob.company ? ` at ${selectedJob.company}` : ''}
              </div>
            )}

            {/* Subscription Tier */}
            {subscriptionTier && (
              <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
                📊 Subscription Tier: <span className="font-semibold capitalize">{subscriptionTier}</span>
              </div>
            )}
          </section>

          {/* Loading State */}
          {loadingJobs || loadingCandidates ? (
            <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
              <p className="text-slate-600">
                {loadingJobs ? 'Loading your jobs...' : 'Loading candidate recommendations...'}
              </p>
            </div>
          ) : null}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
              <p className="text-red-700 font-semibold mb-2">Unable to Load Recommendations</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* No Jobs Posted */}
          {!loadingJobs && jobs.length === 0 && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-[14px] px-8 py-7">
              <p className="text-amber-900">
                You have no posted jobs yet. Post a job to see candidate recommendations.
              </p>
            </div>
          )}

          {/* Empty Recommendations */}
          {!loadingJobs &&
            !loadingCandidates &&
            !error &&
            selectedJobId &&
            recommendedCandidates.length === 0 && (
              <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                <p className="text-slate-600">
                  No candidates match this job yet. Check back later as more candidates join the platform.
                </p>
              </div>
            )}

          {/* Candidates Grid */}
          {!loadingJobs &&
            !loadingCandidates &&
            !error &&
            recommendedCandidates.length > 0 && (
              <>
                <div>
                  <div className="mb-6">
                    <h2 className="text-[1.2rem] font-semibold text-slate-900">
                      Top {Math.min(visibleCount, recommendedCandidates.length)} of{' '}
                      {recommendedCandidates.length} Candidates
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                      Click on any candidate to view their full profile
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {displayedCandidates.map(candidate => (
                      <CandidateCard
                        key={candidate.userId || candidate.id}
                        candidate={candidate}
                      />
                    ))}
                  </div>

                  {recommendedCandidates.length > 6 && (
                    <Showmore
                      visibleCount={visibleCount}
                      totalCount={recommendedCandidates.length}
                      initialCount={6}
                      onShowMore={() =>
                        setVisibleCount(prev =>
                          Math.min(prev + 6, recommendedCandidates.length)
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

export default RecommendedCandidate