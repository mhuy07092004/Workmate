/**
 * recommended_candidate.jsx — Recommended Candidates page (employer view)
 *
 * Features:
 *   - Advanced filter section for finding candidates
 *   - Top-10 candidate recommendations based on the selected job
 *   - Employer search for matching candidates by name, location, major, degree, and more
 *   - Layout with Contact sidebar, main content, and Footer
 */
import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Contact from '../components/Contact/Contact.jsx'
import CandidateCard from '../components/CandidateCard/CandidateCard.jsx'
import CandidateFilter from '../components/FilterSection/CandidateFilter.jsx'
import { getCurrentUserId } from '../services/userService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const INITIAL_VISIBLE_COUNT = 6
const TOP_RECOMMENDED_COUNT = 10

function RecommendedCandidate() {
  const [filters, setFilters] = useState({
    candidateName: '',
    location: '',
    experienceLevel: '',
    degreeType: '',
    major: '',
    certification: '',
    language: '',
    workArrangement: '',
    industry: '',
    roleLevel: '',
    availability: '',
    sortBy: 'Most Relevant',
  })

  const [showFilters, setShowFilters] = useState(false)
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [recommendedCandidates, setRecommendedCandidates] = useState([])
  const [visibleRecommended, setVisibleRecommended] = useState(INITIAL_VISIBLE_COUNT)
  const [visibleSearch, setVisibleSearch] = useState(INITIAL_VISIBLE_COUNT)
  const [loadingCandidates, setLoadingCandidates] = useState(false)
  const [error, setError] = useState(null)

  const currentUserId = getCurrentUserId()
  const employerId = currentUserId ? Number(currentUserId) : null

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`)
        const data = await response.json()
        const jobList = data?.jobs || []

        const employerJobs = employerId
          ? jobList.filter(job => Number(job.user_id) === employerId)
          : []

        setJobs(employerJobs)

        if (employerJobs.length > 0) {
          setSelectedJobId(employerJobs[0].id)
        } else {
          setSelectedJobId(null)
        }
      } catch (fetchError) {
        console.error('Failed to fetch jobs', fetchError)
      }
    }

    fetchJobs()
  }, [employerId])

  useEffect(() => {
    if (!selectedJobId) return

    const fetchCandidates = async () => {
      setLoadingCandidates(true)
      setError(null)

      try {
        const response = await fetch(
          `${API_BASE_URL}/recommendations/candidates?job_id=${selectedJobId}&limit=${TOP_RECOMMENDED_COUNT}`
        )

        if (!response.ok) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body.detail || 'Failed to fetch recommended candidates')
        }

        const data = await response.json()
        const candidates = data?.candidates || []
        setRecommendedCandidates(candidates.slice(0, TOP_RECOMMENDED_COUNT))
        setVisibleRecommended(Math.min(INITIAL_VISIBLE_COUNT, candidates.length))
        setVisibleSearch(INITIAL_VISIBLE_COUNT)
      } catch (fetchError) {
        setError(fetchError.message)
        setRecommendedCandidates([])
      } finally {
        setLoadingCandidates(false)
      }
    }

    fetchCandidates()
  }, [selectedJobId])

  const selectedJob = jobs.find(job => job.id === selectedJobId)

  const hasActiveFilters = useMemo(() => (
    Object.entries(filters).some(([key, value]) => value && value !== 'Most Relevant')
  ), [filters])

  const matchesText = (value, query) => {
    if (!query) return true
    if (!value) return false
    return value.toString().toLowerCase().includes(query.toString().toLowerCase())
  }

  const parseExperience = (experience) => {
    if (!experience) return 0
    const match = experience.toString().match(/(\d+)(?=\s*years?)/i)
    return match ? Number(match[1]) : 0
  }

  const sortCandidates = (list) => {
    const sorted = [...list]
    switch (filters.sortBy) {
      case 'Experience (High to Low)':
        sorted.sort((a, b) => parseExperience(b.experience) - parseExperience(a.experience))
        break
      case 'Experience (Low to High)':
        sorted.sort((a, b) => parseExperience(a.experience) - parseExperience(b.experience))
        break
      case 'Most Recent':
        sorted.sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0
          return new Date(b.created_at) - new Date(a.created_at)
        })
        break
      case 'Most Relevant':
      default:
        sorted.sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0))
        break
    }
    return sorted
  }

  const filteredCandidates = useMemo(() => {
    const filtered = recommendedCandidates.filter(candidate => (
      matchesText(candidate.fullName, filters.candidateName) &&
      matchesText(candidate.location, filters.location) &&
      matchesText(candidate.major, filters.major) &&
      matchesText(candidate.degree || candidate.education_level, filters.degreeType) &&
      matchesText(candidate.certification, filters.certification) &&
      matchesText(candidate.language, filters.language) &&
      matchesText(candidate.workArrangement || candidate.work_arrangement, filters.workArrangement) &&
      matchesText(candidate.industry, filters.industry) &&
      matchesText(candidate.roleLevel || candidate.role_level, filters.roleLevel) &&
      matchesText(candidate.availability, filters.availability)
    ))

    return sortCandidates(filtered)
  }, [recommendedCandidates, filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      candidateName: '',
      location: '',
      experienceLevel: '',
      degreeType: '',
      major: '',
      certification: '',
      language: '',
      workArrangement: '',
      industry: '',
      roleLevel: '',
      availability: '',
      sortBy: 'Most Relevant',
    })
  }

  const handleShowMore = (section) => {
    if (section === 'recommended') {
      setVisibleRecommended(prev => Math.min(prev + 4, recommendedCandidates.length))
    } else {
      setVisibleSearch(prev => Math.min(prev + 4, filteredCandidates.length))
    }
  }

  const handleShowLess = (section) => {
    if (section === 'recommended') {
      setVisibleRecommended(INITIAL_VISIBLE_COUNT)
    } else {
      setVisibleSearch(INITIAL_VISIBLE_COUNT)
    }
  }

  const renderCandidateSection = (title, candidates, visibleCount, sectionKey) => {
    const displayedCandidates = candidates.slice(0, visibleCount)
    const hasMore = visibleCount < candidates.length
    const hasLess = visibleCount > INITIAL_VISIBLE_COUNT

    return (
      <section className="mb-10">
        <div className="mb-6">
          <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">{title}</h2>
        </div>

        {loadingCandidates ? (
          <div className="text-slate-600">Loading candidates...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {displayedCandidates.map(candidate => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
              {displayedCandidates.length === 0 && (
                <div className="col-span-full text-slate-500">
                  No candidates found for this section.
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3">
              {hasMore && (
                <button
                  onClick={() => handleShowMore(sectionKey)}
                  className="cursor-pointer rounded-full border-0 bg-blue-700 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-blue-600 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
                >
                  Show More
                </button>
              )}
              {hasLess && (
                <button
                  onClick={() => handleShowLess(sectionKey)}
                  className="cursor-pointer rounded-full border-0 bg-slate-600 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-slate-700 hover:shadow-[0_4px_14px_rgba(71,85,105,0.3)]"
                >
                  Show Less
                </button>
              )}
            </div>
          </>
        )}
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="mb-2.5 text-[1.6rem] text-slate-900 font-semibold">Recommended Candidates</h1>
                <p className="text-slate-600 leading-relaxed">
                  Top candidates for the selected job are recommended based on the job description and requirements.
                  Use the filters below to search for matching candidates directly.
                </p>
              </div>

              <div className="w-full max-w-md">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Job</label>
                <select
                  value={selectedJobId ?? ''}
                  onChange={(e) => setSelectedJobId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="" disabled>
                    {jobs.length ? 'Select a job' : 'No posted jobs found'}
                  </option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} {job.location ? `• ${job.location}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedJob && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                Recommended for: <span className="font-semibold">{selectedJob.title}</span>
                {selectedJob.company ? ` at ${selectedJob.company}` : ''}
              </div>
            )}
          </section>

          <CandidateFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {selectedJobId && renderCandidateSection(
            `Top ${TOP_RECOMMENDED_COUNT} Candidates for ${selectedJob?.title || 'Selected Job'}`,
            recommendedCandidates,
            visibleRecommended,
            'recommended'
          )}

          {hasActiveFilters && renderCandidateSection(
            'Filtered Candidates',
            filteredCandidates,
            visibleSearch,
            'search'
          )}
        </div>

        <div className="w-[240px] shrink-0 hidden xl:block" />
      </main>

      <Footer />
    </div>
  )
}

export default RecommendedCandidate