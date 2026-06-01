/**
 * applications.jsx — Job applications management page
 *
 * Displays two main sections:
 * - Save Jobs: Shows saved job listings using JobCard components
 * - Jobs Applied: Shows applied job listings using JobCard components
 * - Employer posted jobs integrated with backend
 */

import { useState, useEffect } from 'react'

import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import JobCard from '../components/JobCard/JobCard.jsx'
import CandidateCard from '../components/CandidateCard/CandidateCard.jsx'

import {
  getCurrentUserRole,
  getCurrentUserId
} from '../services/userService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Sample saved candidates for employers
const savedCandidates = [
  {
    id: 1,
    fullName: 'John Smith',
    location: 'Sydney, NSW'
  },
  {
    id: 2,
    fullName: 'Sarah Johnson',
    location: 'Melbourne, VIC'
  },
  {
    id: 3,
    fullName: 'Michael Chen',
    location: 'Brisbane, QLD'
  },
  {
    id: 4,
    fullName: 'Emily Davis',
    location: 'Perth, WA'
  }
]

function Applications() {
  const userRole = getCurrentUserRole()
  const userId = getCurrentUserId()

  const isEmployer = userRole === 'employer'

  // Candidate applied jobs
  const [appliedJobs, setAppliedJobs] = useState([])
  const [isLoadingApplied, setIsLoadingApplied] = useState(false)
  const [appliedError, setAppliedError] = useState('')

  // Employer posted jobs
  const [postedJobs, setPostedJobs] = useState([])
  const [isLoadingPosted, setIsLoadingPosted] = useState(false)
  const [postedError, setPostedError] = useState('')

  const [savedJobs, setSavedJobs] = useState([])
  const [isLoadingSaved, setIsLoadingSaved] = useState(false)
  const [savedError, setSavedError] = useState('')

  /**
   * Get color classes for application status badge
   */
  const getApplicationStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800 border-blue-300',
      reviewing: 'bg-amber-100 text-amber-800 border-amber-300',
      shortlist: 'bg-purple-100 text-purple-800 border-purple-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  /**
   * Get display label for application status
   */
  const getApplicationStatusLabel = (status) => {
    const labels = {
      applied: 'Applied',
      reviewing: 'Reviewing',
      shortlist: 'Shortlisted',
      rejected: 'Rejected',
    }
    return labels[status] || status
  }

  // Fetch candidate applications
  useEffect(() => {
    if (!isEmployer && userId) {
      fetchSavedJobs()
      fetchAppliedJobs()
    }
  }, [userId, isEmployer])

  // Fetch employer posted jobs
  useEffect(() => {
    if (isEmployer && userId) {
      fetchPostedJobs()
    }
  }, [userId, isEmployer])

  /**
   * Helper function to calculate days ago from date string
   */
  const calculateDaysAgo = (dateString) => {
    if (!dateString) return 'recently'

    const date = new Date(dateString)
    const now = new Date()

    const daysAgo = Math.floor(
      (now - date) / (1000 * 60 * 60 * 24)
    )

    if (daysAgo === 0) return 'today'
    if (daysAgo === 1) return '1 day ago'
    if (daysAgo < 7) return `${daysAgo} days ago`
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`
    if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`

    return `${Math.floor(daysAgo / 365)} years ago`
  }

  /**
   * Fetch saved jobs for candidates
   */
  async function fetchSavedJobs() {
    try {
      setIsLoadingSaved(true)
      setSavedError('')

      const token = localStorage.getItem('workmate_token')
      const response = await fetch(`${API_BASE_URL}/saved/user/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch saved jobs')
      }

      const data = await response.json()
      const savedItems = data.saved_items || []

      const jobs = await Promise.all(
        savedItems.map(async (item) => {
          try {
            const jobResponse = await fetch(`${API_BASE_URL}/jobs/${item.job_id}`, {
              headers: { 'Content-Type': 'application/json' },
            })
            if (!jobResponse.ok) return null

            const jobData = await jobResponse.json()
            const job = jobData.job || jobData

            return {
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location,
              employmentType: job.job_type,
              workArrangement: job.job_type,
              postedTime: `Posted ${calculateDaysAgo(job.created_at)}`,
              salary:
                job.salary_min && job.salary_max
                  ? `$${job.salary_min} - $${job.salary_max}`
                  : 'Not specified',
            }
          } catch (err) {
            console.error(`Failed to fetch job ${item.job_id}:`, err)
            return null
          }
        })
      )

      setSavedJobs(jobs.filter(Boolean))
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
      setSavedError(error.message || 'Failed to load saved jobs')
    } finally {
      setIsLoadingSaved(false)
    }
  }

  /**
   * Fetch candidate applied jobs with status
   */
  async function fetchAppliedJobs() {
    try {
      setIsLoadingApplied(true)
      setAppliedError('')

      const token = localStorage.getItem('workmate_token')

      const applicationsResponse = await fetch(
        `${API_BASE_URL}/applications/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!applicationsResponse.ok) {
        throw new Error('Failed to fetch applications')
      }

      const applicationsData = await applicationsResponse.json()
      const applications = applicationsData.applications || []

      const jobsWithDetails = await Promise.all(
        applications.map(async (app) => {
          try {
            const jobResponse = await fetch(
              `${API_BASE_URL}/jobs/${app.job_id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )

            if (!jobResponse.ok) return null

            const jobData = await jobResponse.json()
            const job = jobData.job || jobData

            return {
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location,
              employmentType: job.job_type,
              workArrangement: job.job_type,
              postedTime: `Posted ${calculateDaysAgo(job.created_at)}`,
              salary:
                job.salary_min && job.salary_max
                  ? `$${job.salary_min} - $${job.salary_max}`
                  : 'Not specified',
              applicationStatus: app.status,
              appliedAt: app.applied_at
            }
          } catch (err) {
            console.error(
              `Failed to fetch job ${app.job_id}:`,
              err
            )
            return null
          }
        })
      )

      const validJobs = jobsWithDetails.filter(
        (job) => job !== null
      )

      setAppliedJobs(validJobs)
    } catch (error) {
      console.error(
        'Error fetching applied jobs:',
        error
      )
      setAppliedError(
        error.message || 'Failed to load applied jobs'
      )
    } finally {
      setIsLoadingApplied(false)
    }
  }

  /**
   * Fetch employer posted jobs
   */
  async function fetchPostedJobs() {
    try {
      setIsLoadingPosted(true)
      setPostedError('')

      const token = localStorage.getItem('workmate_token')

      const response = await fetch(
        `${API_BASE_URL}/jobs/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch posted jobs')
      }

      const data = await response.json()
      const allJobs = data.jobs || []

      const myJobs = allJobs
        .filter(
          (job) => job.user_id === parseInt(userId)
        )
        .map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          employmentType: job.job_type,
          workArrangement: 'On Site',
          postedTime: `Posted ${calculateDaysAgo(
            job.created_at
          )}`,
          salary:
            job.salary_min && job.salary_max
              ? `$${job.salary_min} - $${job.salary_max}`
              : 'Not specified'
        }))

      setPostedJobs(myJobs)
    } catch (error) {
      console.error(
        'Error fetching posted jobs:',
        error
      )
      setPostedError(
        error.message || 'Failed to load posted jobs'
      )
    } finally {
      setIsLoadingPosted(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-[1120px] mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isEmployer
                ? 'Applicants'
                : 'My Applications'}
            </h1>

            {!isEmployer && (
              <p className="text-slate-600">
                Manage your saved jobs and application
                history
              </p>
            )}
          </div>

          {/* Saved Jobs / Posted Jobs */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                {isEmployer
                  ? 'Your Posted Jobs'
                  : 'Saved Jobs'}
              </h2>

              <p className="text-slate-600">
                {isEmployer
                  ? 'Jobs you have posted for applicants'
                  : "Jobs you've saved for later review"}
              </p>
            </div>

            {isEmployer ? (
              isLoadingPosted ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">
                    Loading your posted jobs...
                  </p>
                </div>
              ) : postedError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-700 font-medium">
                    Error loading posted jobs
                  </p>

                  <p className="text-red-600 text-sm mt-2">
                    {postedError}
                  </p>
                </div>
              ) : postedJobs.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-blue-700 font-medium">
                    No posted jobs yet
                  </p>

                  <p className="text-blue-600 text-sm mt-2">
                    Post a job to see it here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {postedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                    />
                  ))}
                </div>
              )
            ) : (
              isLoadingSaved ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">
                    Loading your saved jobs...
                  </p>
                </div>
              ) : savedError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-700 font-medium">
                    Error loading saved jobs
                  </p>

                  <p className="text-red-600 text-sm mt-2">
                    {savedError}
                  </p>
                </div>
              ) : savedJobs.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-blue-700 font-medium">
                    No saved jobs yet
                  </p>

                  <p className="text-blue-600 text-sm mt-2">
                    Save jobs to see them here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                    />
                  ))}
                </div>
              )
            )}
          </section>

          {/* Applied Jobs / Saved Candidates */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                {isEmployer
                  ? 'Saved Candidates'
                  : 'Jobs Applied'}
              </h2>

              <p className="text-slate-600">
                {isEmployer
                  ? 'Candidates you have saved for review'
                  : 'Track your job application status'}
              </p>
            </div>

            {isEmployer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                  />
                ))}
              </div>
            ) : (
              <div>
                {isLoadingApplied ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600">
                      Loading your applications...
                    </p>
                  </div>
                ) : appliedError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-700 font-medium">
                      Error loading applications
                    </p>

                    <p className="text-red-600 text-sm mt-2">
                      {appliedError}
                    </p>
                  </div>
                ) : appliedJobs.length === 0 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-blue-700 font-medium">
                      No applications yet
                    </p>

                    <p className="text-blue-600 text-sm mt-2">
                      Start applying for jobs to see them
                      here
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appliedJobs.map((job) => (
                      <div key={job.id} className="flex flex-col">
                        <JobCard job={job} />

                        {/* Application Status Badge */}
                        {job.applicationStatus && (
                          <div className="mt-3 flex items-center justify-center">
                            <div
                              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getApplicationStatusColor(
                                job.applicationStatus
                              )}`}
                            >
                              {getApplicationStatusLabel(
                                job.applicationStatus
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Applications