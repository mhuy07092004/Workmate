/**
 * dashboard.jsx — Main dashboard (role-aware)
 *
 * CANDIDATE VIEW:
 *   - Checks if profile exists first. If not, redirects to /profile
 *   - Displays jobs with integrated JobFilter search (BACKEND)
 *   - Shows news feed and posts
 *   - Search: Keywords + filters sent to POST /jobs/search
 *
 * EMPLOYER VIEW:
 *   - Checks if employer has posted any jobs. If not, shows message.
 *   - Displays candidates with integrated CandidateFilter search (BACKEND)
 *   - Shows news feed and posts
 *   - Search: Keywords + filters sent to POST /candidates/search
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Footer from '../components/Footer/Footer.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import JobCard from '../components/JobCard/JobCard.jsx'
import CandidateCard from '../components/CandidateCard/CandidateCard.jsx'
import NewsCard from '../components/NewsCard/NewsCard.jsx'
import Contact from '../components/Contact/Contact.jsx'
import Post from '../components/Posts/Post.jsx'
import Showmore from '../components/Button/Showmore.jsx'
import JobFilter from '../components/FilterSection/JobFilter.jsx'
import CandidateFilter from '../components/FilterSection/CandidateFilter.jsx'

import { normalizeApiJob } from '../services/jobStore.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getUserRole() {
  return localStorage.getItem('workmate_user_role')
}

function getUserId() {
  return localStorage.getItem('workmate_user_id')
}

function getAuthToken() {
  return localStorage.getItem('workmate_token')
}

/**
 * Generic API fetch helper
 */
async function fetchFromAPI(endpoint, method = 'GET', body = null) {
  const token = getAuthToken()

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: body ? JSON.stringify(body) : undefined,
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

function Dashboard() {
  const navigate = useNavigate()
  const userRole = getUserRole()
  const userId = getUserId()
  const isEmployer = userRole === 'employer'
  const isCandidate = userRole === 'candidate'

  // Profile/Job Check States
  const [profileCheckLoading, setProfileCheckLoading] = useState(true)
  const [profileCheckError, setProfileCheckError] = useState('')
  const [hasProfile, setHasProfile] = useState(false)
  const [employerHasJobs, setEmployerHasJobs] = useState(false)

  // Jobs Data (for candidates)
  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [errorJobs, setErrorJobs] = useState('')
  const [visibleJobs, setVisibleJobs] = useState(6)
  const [searchingJobs, setSearchingJobs] = useState(false)

  // Candidates Data (for employers)
  const [candidates, setCandidates] = useState([])
  const [loadingCandidates, setLoadingCandidates] = useState(true)
  const [errorCandidates, setErrorCandidates] = useState('')
  const [visibleCandidates, setVisibleCandidates] = useState(6)
  const [employerJobs, setEmployerJobs] = useState([])
  const [searchingCandidates, setSearchingCandidates] = useState(false)

  // News & Posts
  const [posts, setPosts] = useState([])
  const [news, setNews] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingNews, setLoadingNews] = useState(true)
  const [visibleNews, setVisibleNews] = useState(4)
  const [visiblePosts, setVisiblePosts] = useState(3)

  // Search/Filter states
  const [jobFilters, setJobFilters] = useState({
    location: '',
    salaryRange: '',
    keyword: '',
    companyName: '',
    employmentType: '',
  })

  const [candidateFilters, setCandidateFilters] = useState({
    keyword: '',
    location: '',
    experienceLevel: '',
    degreeType: '',
    major: '',
  })

  // ─────────────────────────────────────────────────────────
  // CHECK: Candidate Profile Exists
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCandidate) {
      setProfileCheckLoading(false)
      return
    }

    const checkProfile = async () => {
      try {
        setProfileCheckLoading(true)
        setProfileCheckError('')
        const response = await fetchFromAPI(`/profiles/${userId}`)
        if (response.profile) {
          setHasProfile(true)
        } else {
          setHasProfile(false)
        }
      } catch (err) {
        console.error('Profile check error:', err)
        setHasProfile(false)
        setProfileCheckError(
          'Could not verify profile. Redirecting to profile creation...'
        )
        setTimeout(() => {
          navigate('/profile')
        }, 2000)
      } finally {
        setProfileCheckLoading(false)
      }
    }

    checkProfile()
  }, [isCandidate, userId, navigate])

  // ─────────────────────────────────────────────────────────
  // CHECK: Employer Has Posted Jobs
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEmployer) return

    const checkEmployerJobs = async () => {
      try {
        const data = await fetchFromAPI('/jobs')
        const allJobs = data.jobs || []
        const myJobs = allJobs.filter(
          job => Number(job.user_id) === Number(userId)
        )
        setEmployerJobs(myJobs)
        setEmployerHasJobs(myJobs.length > 0)
      } catch (err) {
        console.error('Error checking employer jobs:', err)
        setEmployerHasJobs(false)
      }
    }

    checkEmployerJobs()
  }, [isEmployer, userId])

  // ─────────────────────────────────────────────────────────
  // LOAD: Initial Jobs (Candidate view)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCandidate || !hasProfile) return

    const loadInitialJobs = async () => {
      try {
        setLoadingJobs(true)
        setErrorJobs('')
        const data = await fetchFromAPI('/jobs')
        const allJobs = (data.jobs || []).map(normalizeApiJob)
        const sortedJobs = allJobs.sort((a, b) => b.id - a.id)
        setJobs(sortedJobs)
      } catch (err) {
        console.error('Error loading jobs:', err)
        setErrorJobs(err.message)
        setJobs([])
      } finally {
        setLoadingJobs(false)
      }
    }

    loadInitialJobs()
  }, [isCandidate, hasProfile])

  // ─────────────────────────────────────────────────────────
  // SEARCH: Jobs (Backend - POST /jobs/search)
  // ─────────────────────────────────────────────────────────
  const handleSearchJobs = async () => {
    try {
      setSearchingJobs(true)
      setErrorJobs('')

      // Build search filters for backend
      const searchPayload = {
        keyword: jobFilters.keyword || undefined,
        location: jobFilters.location || undefined,
        job_type: jobFilters.employmentType || undefined,
        company: jobFilters.companyName || undefined,
      }

      // Parse salary range if present (format: "80000-120000" or "80k-120k")
      // Parse salary range if present (format: "80000-120000" or "80k-120k")
      if (jobFilters.salaryRange) {
        const match = jobFilters.salaryRange.match(/^\$?(\d+)(k?)\s*-\s*\$?(\d+)(k?)$/i)
        if (match) {
          const min = parseInt(match[1]) * (match[2].toLowerCase() === 'k' ? 1000 : 1)
          const max = parseInt(match[3]) * (match[4].toLowerCase() === 'k' ? 1000 : 1)
          searchPayload.salary_min = min
          searchPayload.salary_max = max
        }
      }

      // Remove undefined values
      Object.keys(searchPayload).forEach(key =>
        searchPayload[key] === undefined && delete searchPayload[key]
      )

      const data = await fetchFromAPI('/jobs/search', 'POST', searchPayload)
      const searchedJobs = (data.jobs || []).map(normalizeApiJob)
      setJobs(searchedJobs)
      setVisibleJobs(6)
    } catch (err) {
      console.error('Error searching jobs:', err)
      setErrorJobs(err.message)
      setJobs([])
    } finally {
      setSearchingJobs(false)
    }
  }

  // ─────────────────────────────────────────────────────────
  // LOAD: Initial Candidates (Employer view)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isEmployer || !employerHasJobs) return

    const loadInitialCandidates = async () => {
      try {
        setLoadingCandidates(true)
        setErrorCandidates('')
        const data = await fetchFromAPI(
          `/recommendations/candidates?job_id=${employerJobs[0]?.id}&limit=100`
        )
        const allCandidates = data.candidates || []
        setCandidates(allCandidates)
      } catch (err) {
        console.error('Error loading candidates:', err)
        setErrorCandidates(err.message)
        setCandidates([])
      } finally {
        setLoadingCandidates(false)
      }
    }

    loadInitialCandidates()
  }, [isEmployer, employerHasJobs, employerJobs])

  // ─────────────────────────────────────────────────────────
  // SEARCH: Candidates (Backend - POST /candidates/search)
  // ─────────────────────────────────────────────────────────
  const handleSearchCandidates = async () => {
    try {
      setSearchingCandidates(true)
      setErrorCandidates('')

      // Build search filters for backend
      const searchPayload = {
        keyword: candidateFilters.keyword || undefined,
        location: candidateFilters.location || undefined,
        degree_type: candidateFilters.degreeType || undefined,
        major: candidateFilters.major || undefined,
      }

      // Remove undefined values
      Object.keys(searchPayload).forEach(key =>
        searchPayload[key] === undefined && delete searchPayload[key]
      )

      const data = await fetchFromAPI('/candidates/search', 'POST', searchPayload)
      const searchedCandidates = data.candidates || []
      setCandidates(searchedCandidates)
      setVisibleCandidates(6)
    } catch (err) {
      console.error('Error searching candidates:', err)
      setErrorCandidates(err.message)
      setCandidates([])
    } finally {
      setSearchingCandidates(false)
    }
  }

  // ─────────────────────────────────────────────────────────
  // LOAD: News & Posts (All users)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoadingNews(true)
        const data = await fetchFromAPI('/news')
        setNews(data.news || [])
      } catch (err) {
        console.error('Error loading news:', err)
        setNews([])
      } finally {
        setLoadingNews(false)
      }
    }

    loadNews()
  }, [])

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoadingPosts(true)
        const data = await fetchFromAPI('/posts')
        setPosts(data.posts || [])
      } catch (err) {
        console.error('Error loading posts:', err)
        setPosts([])
      } finally {
        setLoadingPosts(false)
      }
    }

    loadPosts()
  }, [])

  // ─────────────────────────────────────────────────────────
  // RENDER: Loading/Error states
  // ─────────────────────────────────────────────────────────
  if (profileCheckLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-slate-600">Loading dashboard...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isCandidate && !hasProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Complete Your Profile
            </h2>
            <p className="text-slate-600 mb-6">
              {profileCheckError ||
                'You need to create a profile before browsing jobs.'}
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Profile
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // RENDER: Candidate Dashboard
  // ─────────────────────────────────────────────────────────
  if (isCandidate) {
    const displayedJobs = jobs.slice(0, visibleJobs)
    const displayedNews = news.slice(0, visibleNews)
    const displayedPosts = posts.slice(0, visiblePosts)

    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />

        <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
          <Contact />

          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {/* Welcome Banner */}
            <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
              <h1 className="mb-2.5 text-[1.6rem] text-slate-900">
                Welcome to Workmate
              </h1>
              <p className="text-slate-600 leading-relaxed">
                Browse the latest job opportunities and find your perfect match.
              </p>
            </section>

            {/* Jobs Section with Search */}
            <section>
              <div className="mb-6">
                <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
                  Job Opportunities
                </h2>
                <p className="text-slate-600">
                  Search by keywords in job descriptions or use filters to narrow down
                </p>
              </div>

              {/* JobFilter with Search Button */}
              <div className="mb-6">
                <JobFilter
                  filters={jobFilters}
                  onFilterChange={(key, value) =>
                    setJobFilters(prev => ({ ...prev, [key]: value }))
                  }
                  onSearch={handleSearchJobs}
                  variant="page"
                  isSearching={searchingJobs}
                />
              </div>

              {/* Loading State */}
              {(loadingJobs || searchingJobs) && (
                <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                  <p className="text-slate-600">
                    {searchingJobs ? 'Searching jobs...' : 'Loading jobs...'}
                  </p>
                </div>
              )}

              {/* Error State */}
              {errorJobs && (
                <div className="bg-red-50 rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                  <p className="text-red-700">Error: {errorJobs}</p>
                </div>
              )}

              {/* Empty State */}
              {!loadingJobs && !searchingJobs && !errorJobs && jobs.length === 0 && (
                <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                  <p className="text-slate-600">No jobs found. Try adjusting your search criteria.</p>
                </div>
              )}

              {/* Jobs Grid */}
              {!loadingJobs && !searchingJobs && !errorJobs && jobs.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {displayedJobs.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>

                  {jobs.length > 6 && (
                    <Showmore
                      visibleCount={visibleJobs}
                      totalCount={jobs.length}
                      initialCount={6}
                      onShowMore={() =>
                        setVisibleJobs(prev => Math.min(prev + 6, jobs.length))
                      }
                      onShowLess={() => setVisibleJobs(6)}
                    />
                  )}
                </>
              )}
            </section>

            {/* News Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
                  Hiring News
                </h2>
                <p className="text-slate-600">
                  Stay updated with the latest hiring trends
                </p>
              </div>

              {loadingNews && <p className="text-slate-600">Loading news...</p>}

              {!loadingNews && news.length === 0 && (
                <p className="text-slate-600">No news available.</p>
              )}

              {!loadingNews && news.length > 0 && (
                <>
                  <div className="space-y-4 mb-6">
                    {displayedNews.map(item => (
                      <NewsCard key={item.id} news={item} />
                    ))}
                  </div>

                  {news.length > 4 && (
                    <Showmore
                      visibleCount={visibleNews}
                      totalCount={news.length}
                      initialCount={4}
                      itemName="News"
                      onShowMore={() =>
                        setVisibleNews(prev => Math.min(prev + 4, news.length))
                      }
                      onShowLess={() => setVisibleNews(4)}
                    />
                  )}
                </>
              )}
            </section>

            {/* Posts Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
                  Community Posts
                </h2>
                <p className="text-slate-600">
                  Connect with professionals and share insights
                </p>
              </div>

              {loadingPosts && <p className="text-slate-600">Loading posts...</p>}

              {!loadingPosts && posts.length === 0 && (
                <p className="text-slate-600">No posts available.</p>
              )}

              {!loadingPosts && posts.length > 0 && (
                <>
                  <div className="space-y-4 mb-6">
                    {displayedPosts.map(post => (
                      <Post key={post.id} post={post} />
                    ))}
                  </div>

                  {posts.length > 3 && (
                    <Showmore
                      visibleCount={visiblePosts}
                      totalCount={posts.length}
                      initialCount={3}
                      itemName="Posts"
                      onShowMore={() =>
                        setVisiblePosts(prev => Math.min(prev + 3, posts.length))
                      }
                      onShowLess={() => setVisiblePosts(3)}
                    />
                  )}
                </>
              )}
            </section>
          </div>

          <div className="w-[240px] shrink-0 hidden xl:block" />
        </main>

        <Footer />
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────
  // RENDER: Employer Dashboard
  // ─────────────────────────────────────────────────────────
  if (isEmployer) {
    const displayedCandidates = candidates.slice(0, visibleCandidates)
    const displayedNews = news.slice(0, visibleNews)
    const displayedPosts = posts.slice(0, visiblePosts)

    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />

        <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
          <Contact />

          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {/* Welcome Banner */}
            <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
              <h1 className="mb-2.5 text-[1.6rem] text-slate-900">
                Welcome to Workmate
              </h1>
              <p className="text-slate-600 leading-relaxed">
                Find and connect with top candidate profiles.
              </p>
            </section>

            {/* No Jobs Posted Message */}
            {!employerHasJobs && (
              <section className="bg-amber-50 border-2 border-amber-200 rounded-[14px] px-8 py-7">
                <h2 className="text-amber-900 font-semibold mb-2">No Posted Jobs Yet</h2>
                <p className="text-amber-800 mb-4">
                  Post a job to see candidate recommendations and browse candidate profiles on this page.
                </p>
                <button
                  onClick={() => navigate('/post-job')}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  Post a Job
                </button>
              </section>
            )}

            {/* Candidates Section (only shown if jobs posted) */}
            {employerHasJobs && (
              <section>
                <div className="mb-6">
                  <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
                    Candidate Profiles
                  </h2>
                  <p className="text-slate-600">
                    Search by keywords or use filters to find the right candidates
                  </p>
                </div>

                {/* CandidateFilter with Search Button */}
                <div className="mb-6">
                  <CandidateFilter
                    filters={candidateFilters}
                    onFilterChange={(key, value) =>
                      setCandidateFilters(prev => ({ ...prev, [key]: value }))
                    }
                    onSearch={handleSearchCandidates}
                    variant="page"
                    isSearching={searchingCandidates}
                  />
                </div>

                {/* Loading State */}
                {(loadingCandidates || searchingCandidates) && (
                  <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                    <p className="text-slate-600">
                      {searchingCandidates ? 'Searching candidates...' : 'Loading candidates...'}
                    </p>
                  </div>
                )}

                {/* Error State */}
                {errorCandidates && (
                  <div className="bg-red-50 rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                    <p className="text-red-700">Error: {errorCandidates}</p>
                  </div>
                )}

                {/* Empty State */}
                {!loadingCandidates && !searchingCandidates && !errorCandidates && candidates.length === 0 && (
                  <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                    <p className="text-slate-600">No candidates found. Try adjusting your search criteria.</p>
                  </div>
                )}

                {/* Candidates Grid */}
                {!loadingCandidates && !searchingCandidates && !errorCandidates && candidates.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                      {displayedCandidates.map(candidate => (
                        <CandidateCard
                          key={candidate.userId || candidate.id}
                          candidate={candidate}
                        />
                      ))}
                    </div>

                    {candidates.length > 6 && (
                      <Showmore
                        visibleCount={visibleCandidates}
                        totalCount={candidates.length}
                        initialCount={6}
                        onShowMore={() =>
                          setVisibleCandidates(prev =>
                            Math.min(prev + 6, candidates.length)
                          )
                        }
                        onShowLess={() => setVisibleCandidates(6)}
                      />
                    )}
                  </>
                )}
              </section>
            )}

            {/* News Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
                  Hiring News
                </h2>
                <p className="text-slate-600">
                  Stay updated with the latest hiring trends
                </p>
              </div>

              {loadingNews && <p className="text-slate-600">Loading news...</p>}

              {!loadingNews && news.length === 0 && (
                <p className="text-slate-600">No news available.</p>
              )}

              {!loadingNews && news.length > 0 && (
                <>
                  <div className="space-y-4 mb-6">
                    {displayedNews.map(item => (
                      <NewsCard key={item.id} news={item} />
                    ))}
                  </div>

                  {news.length > 4 && (
                    <Showmore
                      visibleCount={visibleNews}
                      totalCount={news.length}
                      initialCount={4}
                      itemName="News"
                      onShowMore={() =>
                        setVisibleNews(prev => Math.min(prev + 4, news.length))
                      }
                      onShowLess={() => setVisibleNews(4)}
                    />
                  )}
                </>
              )}
            </section>

            {/* Posts Section */}
            <section>
              <div className="mb-6">
                <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
                  Community Posts
                </h2>
                <p className="text-slate-600">
                  Connect with professionals and share insights
                </p>
              </div>

              {loadingPosts && <p className="text-slate-600">Loading posts...</p>}

              {!loadingPosts && posts.length === 0 && (
                <p className="text-slate-600">No posts available.</p>
              )}

              {!loadingPosts && posts.length > 0 && (
                <>
                  <div className="space-y-4 mb-6">
                    {displayedPosts.map(post => (
                      <Post key={post.id} post={post} />
                    ))}
                  </div>

                  {posts.length > 3 && (
                    <Showmore
                      visibleCount={visiblePosts}
                      totalCount={posts.length}
                      initialCount={3}
                      itemName="Posts"
                      onShowMore={() =>
                        setVisiblePosts(prev => Math.min(prev + 3, posts.length))
                      }
                      onShowLess={() => setVisiblePosts(3)}
                    />
                  )}
                </>
              )}
            </section>
          </div>

          <div className="w-[240px] shrink-0 hidden xl:block" />
        </main>

        <Footer />
      </div>
    )
  }

  return null
}

export default Dashboard