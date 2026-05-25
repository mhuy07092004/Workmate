/**
 * dashboard.jsx — Main dashboard
 *
 * Updated:
 *   - Uses newest backend jobs instead of mock recommendations
 *   - Loading + error handling
 *   - Sort newest jobs first
 *   - Employer/candidate support
 */

import { useState, useEffect } from 'react'

import Footer from '../components/Footer/Footer.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import JobCard from '../components/JobCard/JobCard.jsx'
import NewsCard from '../components/NewsCard/NewsCard.jsx'
import Contact from '../components/Contact/Contact.jsx'
import Post from '../components/Posts/Post.jsx'
import Showmore from '../components/Button/Showmore.jsx'

import { normalizeApiJob } from '../services/jobStore.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getUserRole() {
  return localStorage.getItem('workmate_user_role')
}

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

function Dashboard() {
  /**
   * User role
   */
  const isEmployer =
    getUserRole() === 'employer'

  /**
   * State
   */
  const [jobs, setJobs] = useState([])
  const [posts, setPosts] = useState([])
  const [news, setNews] = useState([])

  /**
   * Loading states
   */
  const [loadingJobs, setLoadingJobs] =
    useState(true)

  const [loadingPosts, setLoadingPosts] =
    useState(true)

  const [loadingNews, setLoadingNews] =
    useState(true)

  /**
   * Error states
   */
  const [errorJobs, setErrorJobs] =
    useState('')

  const [errorPosts, setErrorPosts] =
    useState('')

  const [errorNews, setErrorNews] =
    useState('')

  /**
   * Visible counts
   */
  const [visibleJobs, setVisibleJobs] =
    useState(6)

  const [visibleNews, setVisibleNews] =
    useState(4)

  const [visiblePosts, setVisiblePosts] =
    useState(3)

  /**
   * Load newest jobs
   */
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoadingJobs(true)
        setErrorJobs('')

        const data = await fetchFromAPI('/jobs')

        // Normalize jobs
        const normalizedJobs = (
          data.jobs || []
        ).map(normalizeApiJob)

        /**
         * Sort newest first
         * Higher ID = newer job
         */
        const sortedJobs = normalizedJobs.sort(
          (a, b) => b.id - a.id
        )

        setJobs(sortedJobs)
      } catch (err) {
        console.error(
          'Error loading jobs:',
          err
        )

        setErrorJobs(err.message)
        setJobs([])
      } finally {
        setLoadingJobs(false)
      }
    }

    loadJobs()
  }, [])

  /**
   * Load posts
   */
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoadingPosts(true)
        setErrorPosts('')

        const data = await fetchFromAPI('/posts')

        setPosts(data.posts || [])
      } catch (err) {
        console.error(
          'Error loading posts:',
          err
        )

        setErrorPosts(err.message)
        setPosts([])
      } finally {
        setLoadingPosts(false)
      }
    }

    loadPosts()
  }, [])

  /**
   * Load news
   */
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoadingNews(true)
        setErrorNews('')

        const data = await fetchFromAPI('/news')

        setNews(data.news || [])
      } catch (err) {
        console.error(
          'Error loading news:',
          err
        )

        setErrorNews(err.message)
        setNews([])
      } finally {
        setLoadingNews(false)
      }
    }

    loadNews()
  }, [])

  /**
   * Show more handlers
   */
  const handleShowMoreJobs = () => {
    setVisibleJobs(prev =>
      Math.min(prev + 6, jobs.length)
    )
  }

  const handleShowMoreNews = () => {
    setVisibleNews(prev =>
      Math.min(prev + 4, news.length)
    )
  }

  const handleShowMorePosts = () => {
    setVisiblePosts(prev =>
      Math.min(prev + 3, posts.length)
    )
  }

  /**
   * Visible data
   */
  const displayedJobs = jobs.slice(
    0,
    visibleJobs
  )

  const displayedNews = news.slice(
    0,
    visibleNews
  )

  const displayedPosts = posts.slice(
    0,
    visiblePosts
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
        <Contact />

        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Welcome Banner */}
          <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
            <h1 className="mb-2.5 text-[1.6rem] text-slate-900">
              Welcome to Workmate Dashboard
            </h1>

            <p className="text-slate-600 leading-relaxed">
              You are signed in successfully.
              Browse the latest jobs,
              applications, and community
              updates.
            </p>
          </section>

          {/* Jobs Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
                {isEmployer
                  ? 'Newest Posted Jobs'
                  : 'Newest Jobs'}
              </h2>

              <p className="text-slate-600">
                {isEmployer
                  ? 'Latest jobs posted on the platform'
                  : 'Discover the newest opportunities available right now'}
              </p>
            </div>

            {/* Loading */}
            {loadingJobs && (
              <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                <p className="text-slate-600">
                  Loading newest jobs...
                </p>
              </div>
            )}

            {/* Error */}
            {errorJobs && (
              <div className="bg-red-50 rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                <p className="text-red-700">
                  Error loading jobs:{' '}
                  {errorJobs}
                </p>
              </div>
            )}

            {/* Empty */}
            {!loadingJobs &&
              !errorJobs &&
              jobs.length === 0 && (
                <div className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
                  <p className="text-slate-600">
                    No jobs available at this
                    time.
                  </p>
                </div>
              )}

            {/* Jobs */}
            {!loadingJobs &&
              !errorJobs &&
              jobs.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {displayedJobs.map(job => (
                      <JobCard
                        key={job.id}
                        job={job}
                      />
                    ))}
                  </div>

                  {jobs.length > 6 && (
                    <Showmore
                      visibleCount={
                        visibleJobs
                      }
                      totalCount={jobs.length}
                      initialCount={6}
                      onShowMore={
                        handleShowMoreJobs
                      }
                      onShowLess={() =>
                        setVisibleJobs(6)
                      }
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
                Stay updated with the latest
                hiring trends and company
                news
              </p>
            </div>

            {loadingNews && (
              <p className="text-slate-600">
                Loading news...
              </p>
            )}

            {errorNews && (
              <p className="text-red-600">
                Error loading news:{' '}
                {errorNews}
              </p>
            )}

            {!loadingNews &&
              news.length === 0 && (
                <p className="text-slate-600">
                  No news available at this
                  time.
                </p>
              )}

            {!loadingNews &&
              news.length > 0 && (
                <>
                  <div className="space-y-4 mb-6">
                    {displayedNews.map(
                      item => (
                        <NewsCard
                          key={item.id}
                          news={item}
                        />
                      )
                    )}
                  </div>

                  {news.length > 4 && (
                    <Showmore
                      visibleCount={
                        visibleNews
                      }
                      totalCount={news.length}
                      initialCount={4}
                      itemName="News"
                      onShowMore={
                        handleShowMoreNews
                      }
                      onShowLess={() =>
                        setVisibleNews(4)
                      }
                    />
                  )}
                </>
              )}
          </section>

          {/* Posts Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">
                Posts
              </h2>

              <p className="text-slate-600">
                Connect with professionals and
                share insights
              </p>
            </div>

            {loadingPosts && (
              <p className="text-slate-600">
                Loading posts...
              </p>
            )}

            {errorPosts && (
              <p className="text-red-600">
                Error loading posts:{' '}
                {errorPosts}
              </p>
            )}

            {!loadingPosts &&
              posts.length === 0 && (
                <p className="text-slate-600">
                  No posts available at this
                  time.
                </p>
              )}

            {!loadingPosts &&
              posts.length > 0 && (
                <>
                  <div className="space-y-4 mb-6">
                    {displayedPosts.map(
                      post => (
                        <Post
                          key={post.id}
                          post={post}
                        />
                      )
                    )}
                  </div>

                  {posts.length > 3 && (
                    <Showmore
                      visibleCount={
                        visiblePosts
                      }
                      totalCount={
                        posts.length
                      }
                      initialCount={3}
                      itemName="Posts"
                      onShowMore={
                        handleShowMorePosts
                      }
                      onShowLess={() =>
                        setVisiblePosts(3)
                      }
                    />
                  )}
                </>
              )}
          </section>
        </div>

        {/* Right Spacer */}
        <div className="w-[240px] shrink-0 hidden xl:block" />
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard