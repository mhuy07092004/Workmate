import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Contact from '../components/Contact/Contact.jsx'
import JobCard from '../components/JobCard/JobCard.jsx'
import JobFilter from '../components/FilterSection/JobFilter.jsx'
import { normalizeApiJob } from '../services/jobStore.js'
import { getCurrentUserId } from '../services/userService.js'

// Change this if your backend runs elsewhere
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const AI_CHOSEN_JOBS = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Google',
    employmentType: 'Full Time',
    workArrangement: 'On Site',
    location: 'Sydney, NSW',
    postedTime: 'Posted 2 days ago',
  },
  {
    id: 2,
    title: 'Data Scientist',
    company: 'Amazon',
    employmentType: 'Full Time',
    workArrangement: 'Hybrid',
    location: 'Melbourne, VIC',
    postedTime: 'Posted 3 days ago',
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'Atlassian',
    employmentType: 'Full Time',
    workArrangement: 'Hybrid',
    location: 'Sydney, NSW',
    postedTime: 'Posted 1 week ago',
  },
  {
    id: 4,
    title: 'UX Designer',
    company: 'Canva',
    employmentType: 'Full Time',
    workArrangement: 'Hybrid',
    location: 'Sydney, NSW',
    postedTime: 'Posted 5 days ago',
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Microsoft',
    employmentType: 'Full Time',
    workArrangement: 'On Site',
    location: 'Brisbane, QLD',
    postedTime: 'Posted 1 day ago',
  },
  {
    id: 6,
    title: 'Frontend Developer',
    company: 'WiseTech',
    employmentType: 'Contract',
    workArrangement: 'Hybrid',
    location: 'Sydney, NSW',
    postedTime: 'Posted 4 days ago',
  },
]

const EMPTY_FILTERS = {
  location: '',
  salaryRange: '',
  jobTitle: '',
  companyName: '',
  employmentType: '',
}

const JOB_TYPE_MAP = {
  'Full Time': 'Full-time',
  'Part Time': 'Part-time',
  Contract: 'Contract',
  Remote: 'Remote',
  Hybrid: 'Hybrid',
}

function parseSalaryRange(value) {
  if (!value) return {}

  const match = value.match(/^\$?(\d+)(k)?\s*-\s*\$?(\d+)(k)?$/i)
  if (!match) return {}

  const parseAmount = (num, k) => {
    const amount = Number(num)
    return k ? amount * 1000 : amount
  }

  return {
    salary_min: parseAmount(match[1], match[2]),
    salary_max: parseAmount(match[3], match[4]),
  }
}

function buildSearchPayload(filters) {
  const payload = {}

  if (filters.location) payload.location = filters.location
  if (filters.jobTitle) payload.title = filters.jobTitle
  if (filters.companyName) payload.company = filters.companyName

  if (filters.employmentType) {
    payload.job_type =
      JOB_TYPE_MAP[filters.employmentType] || filters.employmentType
  }

  const salary = parseSalaryRange(filters.salaryRange)

  if (salary.salary_min != null) {
    payload.salary_min = salary.salary_min
  }

  if (salary.salary_max != null) {
    payload.salary_max = salary.salary_max
  }

  return payload
}

function RecommendedJob() {
  const routeState = useLocation().state

  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    ...(routeState ?? {}),
  }))

  const [showFilters, setShowFilters] = useState(false)

  const [visibleCounts, setVisibleCounts] = useState({
    aiChosen: 6,
    related: 6,
    recommended: 6,
  })

  const [searchApplied, setSearchApplied] = useState(false)

  const [relatedJobs, setRelatedJobs] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [relatedError, setRelatedError] = useState('')

  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [recommendationLoading, setRecommendationLoading] = useState(false)
  const [recommendationError, setRecommendationError] = useState('')

  const filteredAiChosen = useMemo(() => AI_CHOSEN_JOBS, [])

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      setRecommendationLoading(true)
      setRecommendationError('')

      try {
        const userId = getCurrentUserId()

        if (!userId) {
          setRecommendationError(
            'No current user ID found. Log in to get recommendations.'
          )
          return
        }

        const response = await fetch(
          `${API_BASE_URL}/candidates/recommended-jobs/${parseInt(
            userId,
            10
          )}?limit=10`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.detail ||
            data.error ||
            'Failed to load recommended jobs'
          )
        }

        const normalized = (data.jobs || []).map(normalizeApiJob)

        setRecommendedJobs(normalized)
      } catch (err) {
        console.error('Recommendation fetch error:', err)

        setRecommendationError(
          err.message || 'Unable to load recommended jobs'
        )
      } finally {
        setRecommendationLoading(false)
      }
    }

    fetchRecommendedJobs()
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))

    if (searchApplied) {
      setSearchApplied(false)
    }
  }

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setSearchApplied(false)
    setRelatedJobs([])
    setRelatedError('')
  }

  const handleApplyFilters = async () => {
    setShowFilters(false)
    setRelatedLoading(true)
    setRelatedError('')
    setSearchApplied(false)

    try {
      const payload = buildSearchPayload(filters)

      const response = await fetch(`${API_BASE_URL}/jobs/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to search jobs')
      }

      setRelatedJobs((data.jobs || []).map(normalizeApiJob))
      setSearchApplied(true)
    } catch (err) {
      console.error('Job search error:', err)

      setRelatedError(err.message || 'Job search failed')
    } finally {
      setRelatedLoading(false)
    }
  }

  const handleShowMore = section => {
    setVisibleCounts(prev => ({
      ...prev,
      [section]: Math.min(
        prev[section] + 6,
        section === 'aiChosen'
          ? filteredAiChosen.length
          : section === 'related'
            ? relatedJobs.length
            : recommendedJobs.length
      ),
    }))
  }

  const handleShowLess = section => {
    setVisibleCounts(prev => ({
      ...prev,
      [section]: 6,
    }))
  }

  const renderJobSection = (
    title,
    jobs,
    visibleCount,
    sectionKey,
    info = null
  ) => {
    const displayedJobs = jobs.slice(0, visibleCount)

    const hasMore = visibleCount < jobs.length
    const hasLess = visibleCount > 6

    return (
      <section className="mb-10">
        <div className="mb-6">
          <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
            {title}
          </h2>

          {info && (
            <p className="text-sm text-slate-500">
              {info}
            </p>
          )}
        </div>

        {displayedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {displayedJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="mb-6 text-[0.95rem] text-slate-500 italic">
            No jobs match the current filters.
          </p>
        )}

        <div className="flex justify-center gap-3">
          {hasMore && (
            <button
              onClick={() => handleShowMore(sectionKey)}
              className="cursor-pointer rounded-full border-0 bg-blue-700 px-[22px] py-[9px] text-[0.92rem] font-bold text-white hover:bg-blue-600"
            >
              Show More
            </button>
          )}

          {hasLess && (
            <button
              onClick={() => handleShowLess(sectionKey)}
              className="cursor-pointer rounded-full border-0 bg-slate-600 px-[22px] py-[9px] text-[0.92rem] font-bold text-white hover:bg-slate-700"
            >
              Show Less
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
        <Contact />

        <div className="flex-1 min-w-0 flex flex-col gap-8">
          <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
            <h1 className="mb-2.5 text-[1.6rem] text-slate-900 font-semibold">
              Recommended Jobs
            </h1>

            <p className="text-slate-600 leading-relaxed">
              Discover personalized job opportunities curated just for you.
            </p>
          </section>

          <JobFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {searchApplied && (
            <>
              {relatedLoading && (
                <div className="text-slate-600">
                  Searching jobs…
                </div>
              )}

              {relatedError && (
                <div className="text-red-500 mb-4">
                  {relatedError}
                </div>
              )}

              {renderJobSection(
                'Related Roles',
                relatedJobs,
                visibleCounts.related,
                'related'
              )}
            </>
          )}

          {renderJobSection(
            'Recommended For You',
            recommendedJobs.length > 0
              ? recommendedJobs
              : filteredAiChosen,
            visibleCounts.recommended,
            'recommended',
            recommendationLoading
              ? 'Loading recommendations…'
              : recommendationError
                ? recommendationError
                : 'Jobs matched to your resume and profile using personalized recommendations.'
          )}

          {/* {renderJobSection(
            'Chosen By Workmate A.I',
            filteredAiChosen,
            visibleCounts.aiChosen,
            'aiChosen'
          )} */}
        </div>

        <div className="w-[240px] shrink-0 hidden xl:block" />
      </main>

      <Footer />
    </div>
  )
}

export default RecommendedJob