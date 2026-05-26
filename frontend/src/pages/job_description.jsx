import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import JobTitle from '../components/JobDesription/JobTitle.jsx'
import JobDetails from '../components/JobDesription/JobDetails.jsx'
import ApplyJob from '../components/Button/ApplyJob.jsx'
import SaveJob from '../components/Button/SaveJob.jsx'
import CandidateCard from '../components/CandidateCard/CandidateCard.jsx'

import { normalizeApiJob } from '../services/jobStore.js'
import { getCurrentUserRole, getCurrentUserId } from '../services/userService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function JobDescription() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [apiJob, setApiJob] = useState(null)
  const [loadingJob, setLoadingJob] = useState(false)
  const [jobError, setJobError] = useState('')
  const [applicants, setApplicants] = useState([])

  const [savingJob, setSavingJob] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [savedId, setSavedId] = useState(null)

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoadingJob(true)
        setJobError('')

        const response = await fetch(`${API_BASE_URL}/jobs/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.detail || data.error || 'Job not found')
        }

        setApiJob(normalizeApiJob(data.job))
      } catch (err) {
        setJobError(err.message)
      } finally {
        setLoadingJob(false)
      }
    }

    loadJob()
  }, [id])

  useEffect(() => {
    const loadApplicants = async () => {
      if (
        !apiJob ||
        getCurrentUserRole() !== 'employer' ||
        apiJob.user_id !== parseInt(getCurrentUserId(), 10)
      ) {
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/applications/job/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('workmate_token')}`,
          },
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || data.error || 'Failed to load applicants')
        setApplicants(data.applicants || [])
      } catch (err) {
        console.error(err)
      }
    }

    loadApplicants()
  }, [apiJob, id])

  useEffect(() => {
    const checkSaved = async () => {
      const userId = localStorage.getItem('workmate_user_id')
      if (!userId) return

      try {
        const res = await fetch(`${API_BASE_URL}/saved/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('workmate_token')}`,
          },
        })

        if (!res.ok) return

        const data = await res.json()
        const savedItem = (data.saved_items || []).find(
          (item) => String(item.job_id) === String(id)
        )

        if (savedItem) {
          setIsSaved(true)
          setSavedId(savedItem.id)
        } else {
          setIsSaved(false)
          setSavedId(null)
        }
      } catch (err) {
        console.error('Failed to load saved jobs', err)
      }
    }

    checkSaved()
  }, [id])

  const isOwnerView =
    getCurrentUserRole() === 'employer' &&
    apiJob &&
    apiJob.user_id === parseInt(getCurrentUserId(), 10)

  const isCandidate = getCurrentUserRole() === 'candidate'

  const handleApply = () => {
    navigate(`/job/${id}/application`)
  }

  const handleSaveToggle = async () => {
    try {
      setSavingJob(true)
      setSaveMessage('')

      const userId = localStorage.getItem('workmate_user_id')
      if (!userId) {
        setSaveMessage('Please log in to save jobs')
        return
      }

      if (isSaved && savedId) {
        const response = await fetch(`${API_BASE_URL}/saved/${savedId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('workmate_token')}`,
          },
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.detail || data.error || 'Failed to remove saved job')

        setSaveMessage('Job removed from saved jobs.')
        setIsSaved(false)
        setSavedId(null)
        return
      }

      const response = await fetch(`${API_BASE_URL}/saved/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('workmate_token')}`,
        },
        body: JSON.stringify({
          user_id: parseInt(userId, 10),
          job_id: parseInt(id, 10),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || data.error || 'Failed to save job')

      setSaveMessage('Job saved to your list.')
      setIsSaved(true)
      setSavedId(data.saved_item?.id ?? null)
    } catch (err) {
      setSaveMessage(err.message)
    } finally {
      setSavingJob(false)
    }
  }

  if (loadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading job...
      </div>
    )
  }

  if (jobError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {jobError}
      </div>
    )
  }

  if (!apiJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading job...
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-8">
        <JobTitle
          title={apiJob.title}
          company={apiJob.company}
          postedDate={apiJob.postedDate}
        />

        <div className="mt-6 flex items-center gap-4 flex-wrap">
          {isCandidate && !isOwnerView && (
            <>
              <ApplyJob onClick={handleApply} />
              <SaveJob onClick={handleSaveToggle} disabled={savingJob} isSaved={isSaved} />
            </>
          )}

          <div className="text-slate-600">
            <span className="font-medium">{apiJob.location}</span>
            <span className="mx-2 text-slate-400">|</span>
            <span>{apiJob.type}</span>
            <span className="mx-2 text-slate-400">|</span>
            <span className="text-green-600 font-medium">{apiJob.salary}</span>
          </div>
        </div>

        {saveMessage && (
          <div className="mt-4 text-sm text-slate-700">{saveMessage}</div>
        )}

        {isOwnerView && (
          <section className="mt-8">
            <h2 className="text-[1.3rem] font-semibold text-slate-900 mb-1">
              Candidates Applied
            </h2>

            <p className="text-slate-600 mb-5">
              Applicants who have expressed interest in this role
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {applicants.map((c) => (
                <CandidateCard key={c.user_id} candidate={c} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-6">
          <JobDetails description={apiJob.description} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobDescription