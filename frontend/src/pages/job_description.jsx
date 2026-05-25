/**
 * job_description.jsx — Job Description page
 *
 * Features:
 *   - Navbar and Footer layout
 *   - Job title with company and posted date
 *   - Apply button
 *   - Detailed job description sections
 *   - Uses route param :id for dynamic routing
 */

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import JobTitle from '../components/JobDesription/JobTitle.jsx'
import JobDetails from '../components/JobDesription/JobDetails.jsx'
import ApplyJob from '../components/Button/ApplyJob.jsx'
import CandidateCard from '../components/CandidateCard/CandidateCard.jsx'

import { getPostedJobById, normalizeApiJob } from '../services/jobStore.js'
import { getCurrentUserRole, getCurrentUserId } from '../services/userService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// // Mock applicants shown when the employer views their own sample listing
// const MOCK_SAMPLE_APPLICANTS = [
//   { id: 1, fullName: 'John Smith', location: 'Sydney, NSW', jobApplied: 'sample test' },
//   { id: 2, fullName: 'Sarah Johnson', location: 'Melbourne, VIC', jobApplied: 'sample test' },
//   { id: 3, fullName: 'Michael Chen', location: 'Brisbane, QLD', jobApplied: 'sample test' },
// ]

// // Dedicated mock detail for the employer-owned sample listing
// const MOCK_SAMPLE_JOB = {
//   id: 'sample',
//   title: 'sample test',
//   company: 'TechCorp Inc.',
//   postedDate: '2026-05-16',
//   location: 'San Francisco, CA',
//   type: 'Full Time',
//   salary: '$120k - $160k',
//   description: {
//     requirements: `We are looking for a talented engineer to join TechCorp Inc. You will work closely with our product and design teams to build next-generation software solutions.

// Key Responsibilities:
// • Build and maintain web applications using React and Node.js
// • Write automated tests and participate in code reviews
// • Collaborate with stakeholders to refine product requirements
// • Contribute to architecture and technical design discussions`,

//     whatWeNeed: `Required Qualifications:
// • Bachelor's degree in Computer Science or equivalent experience
// • 2+ years of professional software development
// • Proficiency in JavaScript/TypeScript, React, and REST APIs
// • Familiarity with Git and agile workflows

// Preferred Qualifications:
// • Experience with cloud services (AWS, GCP)
// • Knowledge of CI/CD pipelines`,

//     aboutCompany: `TechCorp Inc. is a fast-growing technology company building next-generation software solutions. Based in San Francisco, we look for passionate individuals who want to make an impact.`,

//     benefits: `• Competitive salary and equity
// • Comprehensive health insurance
// • Flexible remote work policy
// • Professional development stipend
// • Generous PTO and parental leave`,
//   },
// }

// // Default fallback mock
// const MOCK_JOB_DATA = {
//   id: 1,
//   title: 'Senior Software Engineer',
//   company: 'Google',
//   postedDate: '2025-04-20',
//   location: 'Sydney, NSW',
//   type: 'Full Time',
//   salary: '$150k - $200k',

//   description: {
//     requirements: `We are looking for an experienced Software Engineer to join our growing team.

// Key Responsibilities:
// • Design and develop scalable software solutions
// • Collaborate with cross-functional teams
// • Write clean and maintainable code
// • Participate in code reviews
// • Troubleshoot technical issues`,

//     whatWeNeed: `Required Qualifications:
// • Bachelor's degree in Computer Science
// • 5+ years of experience
// • Strong React and Node.js skills
// • Cloud platform experience
// • Strong communication skills`,

//     aboutCompany: `Google is a global technology leader focused on improving the ways people connect with information.`,

//     benefits: `• Competitive salary
// • Health insurance
// • Flexible work options
// • Professional development budget`,
//   },
// }

function JobDescription() {
  const { id } = useParams()

  const [apiJob, setApiJob] = useState(null)
  const [loadingJob, setLoadingJob] = useState(false)
  const [jobError, setJobError] = useState('')
  const [applicants, setApplicants] = useState([])

  const [isApplying, setIsApplying] = useState(false)
  const [applyError, setApplyError] = useState('')

  // Load API job
  useEffect(() => {
    if (id === 'sample') return

    const loadJob = async () => {
      console.log(1)
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
        console.error(err)
        setJobError(err.message)
      } finally {
        setLoadingJob(false)
      }
    }

    loadJob()
  }, [id])

  // Local posted jobs
  const postedJob = getPostedJobById(id)

  function buildPostedJobExtras(pj) {
    const lines = []

    if (!pj) return ''

    if (pj.industry) lines.push(`Industry: ${pj.industry}`)
    if (pj.roleLevel) lines.push(`Role Level: ${pj.roleLevel}`)
    if (pj.majorField || pj.major) {
      lines.push(`Major / Field of Study: ${pj.majorField || pj.major}`)
    }

    if (pj.certification) {
      lines.push(`Required Certification: ${pj.certification}`)
    }

    if (pj.preferredLanguages?.length > 0) {
      lines.push(`Preferred Languages: ${pj.preferredLanguages.join(', ')}`)
    }

    if (pj.availability?.mode) {
      const avail = pj.availability.date
        ? `${pj.availability.mode} (${pj.availability.date})`
        : pj.availability.mode

      lines.push(`Start Availability: ${avail}`)
    }

    return lines.length > 0
      ? '\n\nAdditional Requirements:\n• ' + lines.join('\n• ')
      : ''
  }

  // Resolve final job
  let job = null;

  if (apiJob) {
    job = apiJob;
  }

  useEffect(() => {
    const loadApplicants = async () => {
      if (
        !apiJob ||
        getCurrentUserRole() !== "employer" ||
        apiJob.user_id !== parseInt(getCurrentUserId(), 10)
      ) {
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/applications/job/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("workmate_token")}`,
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

  const isOwnerView =
    getCurrentUserRole() === 'employer' && apiJob && apiJob.user_id === parseInt(getCurrentUserId())

  // Apply handler
  const handleApply = async () => {
    try {
      setIsApplying(true)
      setApplyError('')

      const userId = getCurrentUserId()

      if (!userId) {
        alert('Please log in to apply for jobs')
        return
      }

      const response = await fetch(`${API_BASE_URL}/applications/`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('workmate_token')}`,
        },

        body: JSON.stringify({
          user_id: parseInt(userId),
          job_id: parseInt(job.id),
          status: 'applied',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || data.error || 'Failed to apply for job'
        )
      }

      alert('Successfully applied for the job!')
    } catch (error) {
      console.error('Apply error:', error)

      setApplyError(error.message)

      alert(`Error applying for job: ${error.message}`)
    } finally {
      setIsApplying(false)
    }
  }

  // Loading UI
  if (loadingJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading job...
      </div>
    )
  }

  // Error UI
  if (jobError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {jobError}
      </div>
    )
  }

  if (!job) {
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
        {/* Job Title */}
        <JobTitle
          title={job.title}
          company={job.company}
          postedDate={job.postedDate}
        />

        {/* Action row */}
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          {!isOwnerView && (
            <ApplyJob
              onClick={handleApply}
              disabled={isApplying}
            />
          )}

          <div className="text-slate-600">
            <span className="font-medium">{job.location}</span>

            <span className="mx-2 text-slate-400">|</span>

            <span>{job.type}</span>

            <span className="mx-2 text-slate-400">|</span>

            <span className="text-green-600 font-medium">
              {job.salary}
            </span>
          </div>
        </div>

        {/* Apply error */}
        {applyError && (
          <div className="mt-4 text-red-500">
            {applyError}
          </div>
        )}

        {/* Employer applicant section */}
        {isOwnerView && (
          <section className="mt-8">
            <h2 className="text-[1.3rem] font-semibold text-slate-900 mb-1">
              Candidates Applied
            </h2>

            <p className="text-slate-600 mb-5">
              Applicants who have expressed interest in this role
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {applicants.map(c => (
                <CandidateCard key={c.user_id} candidate={c} />
              ))}
            </div>
          </section>
        )}

        {/* Job details */}
        <div className="mt-6">
          <JobDetails description={job.description} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default JobDescription