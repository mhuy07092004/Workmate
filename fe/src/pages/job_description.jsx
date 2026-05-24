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
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import JobTitle from '../components/JobDesription/JobTitle.jsx'
import JobDetails from '../components/JobDesription/JobDetails.jsx'
import ApplyJob from '../components/Button/ApplyJob.jsx'
import SaveJob from '../components/Button/SaveJob.jsx'
import CandidateCard from '../components/CandidateCard/CandidateCard.jsx'
import { getPostedJobById } from '../services/jobStore.js'
import { getCurrentUserRole } from '../services/userService.js'

// Mock applicants shown when the employer views their own sample listing
const MOCK_SAMPLE_APPLICANTS = [
  { id: 1, fullName: 'John Smith', location: 'Sydney, NSW', jobApplied: 'sample test' },
  { id: 2, fullName: 'Sarah Johnson', location: 'Melbourne, VIC', jobApplied: 'sample test' },
  { id: 3, fullName: 'Michael Chen', location: 'Brisbane, QLD', jobApplied: 'sample test' },
]

// Dedicated mock detail for the employer-owned sample listing
const MOCK_SAMPLE_JOB = {
  id: 'sample',
  title: 'sample test',
  company: 'TechCorp Inc.',
  postedDate: '2026-05-16',
  location: 'San Francisco, CA',
  type: 'Full Time',
  salary: '$120k - $160k',
  description: {
    requirements: `We are looking for a talented engineer to join TechCorp Inc. You will work closely with our product and design teams to build next-generation software solutions.

Key Responsibilities:
• Build and maintain web applications using React and Node.js
• Write automated tests and participate in code reviews
• Collaborate with stakeholders to refine product requirements
• Contribute to architecture and technical design discussions`,
    whatWeNeed: `Required Qualifications:
• Bachelor's degree in Computer Science or equivalent experience
• 2+ years of professional software development
• Proficiency in JavaScript/TypeScript, React, and REST APIs
• Familiarity with Git and agile workflows

Preferred Qualifications:
• Experience with cloud services (AWS, GCP)
• Knowledge of CI/CD pipelines`,
    aboutCompany: `TechCorp Inc. is a fast-growing technology company building next-generation software solutions. Based in San Francisco, we look for passionate individuals who want to make an impact.`,
    benefits: `• Competitive salary and equity
• Comprehensive health insurance
• Flexible remote work policy
• Professional development stipend
• Generous PTO and parental leave`,
  },
}

// Mock data for job description (default / non-sample)
const MOCK_JOB_DATA = {
  id: 1,
  title: 'Senior Software Engineer',
  company: 'Google',
  postedDate: '2025-04-20',
  location: 'Sydney, NSW',
  type: 'Full Time',
  salary: '$150k - $200k',
  description: {
    requirements: `We are looking for an experienced Software Engineer to join our growing team. The ideal candidate will have a strong background in software development, with expertise in modern web technologies and cloud platforms.

Key Responsibilities:
• Design and develop scalable software solutions
• Collaborate with cross-functional teams to define and implement new features
• Write clean, maintainable, and well-tested code
• Participate in code reviews and mentor junior developers
• Troubleshoot and debug complex technical issues`,
    whatWeNeed: `We need someone who is passionate about building great products and has a track record of delivering high-quality software. You should be comfortable working in a fast-paced environment and be able to adapt to changing requirements.

Required Qualifications:
• Bachelor's degree in Computer Science or related field
• 5+ years of professional software development experience
• Strong proficiency in JavaScript, React, and Node.js
• Experience with cloud platforms (AWS, GCP, or Azure)
• Excellent problem-solving and communication skills

Preferred Qualifications:
• Experience with TypeScript and modern frontend frameworks
• Knowledge of microservices architecture
• Familiarity with CI/CD pipelines and DevOps practices`,
    aboutCompany: `Google is a global technology leader focused on improving the ways people connect with information. Our innovations in web search and advertising have made our website a top internet property and our brand one of the most recognized in the world.

We are committed to building a diverse and inclusive workplace where everyone can thrive. Our Sydney office is home to teams working on cutting-edge products that impact billions of users worldwide.`,
    benefits: `• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote work options
• Professional development budget
• 20 days annual leave plus public holidays
• Parental leave and family support programs
• On-site gym and wellness programs
• Free meals and snacks at the office`,
  },
}

function JobDescription() {
  const { id } = useParams()

  // TODO (backend integration): fetch from GET /api/jobs/:id
  // For now, check the employer-posted store first, then fall back to mock data.
  const postedJob = getPostedJobById(id)

  function buildPostedJobExtras(pj) {
    const lines = []
    if (pj.industry) lines.push(`Industry: ${pj.industry}`)
    if (pj.roleLevel) lines.push(`Role Level: ${pj.roleLevel}`)
    if (pj.majorField || pj.major) lines.push(`Major / Field of Study: ${pj.majorField || pj.major}`)
    if (pj.certification) lines.push(`Required Certification: ${pj.certification}`)
    if (pj.preferredLanguages && pj.preferredLanguages.length > 0) {
      lines.push(`Preferred Languages: ${pj.preferredLanguages.join(', ')}`)
    }
    if (pj.availability && pj.availability.mode) {
      const avail = pj.availability.date
        ? `${pj.availability.mode} (${pj.availability.date})`
        : pj.availability.mode
      lines.push(`Start Availability: ${avail}`)
    }
    return lines.length > 0 ? '\n\nAdditional Requirements:\n• ' + lines.join('\n• ') : ''
  }

  // Resolve the job object: sample listing → employer-posted store → generic mock
  const job = id === 'sample'
    ? MOCK_SAMPLE_JOB
    : postedJob
      ? {
          ...MOCK_JOB_DATA,
          id: postedJob.id,
          title: postedJob.title,
          company: postedJob.company,
          location: postedJob.location,
          type: `${postedJob.employmentType} · ${postedJob.workArrangement}`,
          salary: postedJob.salary || MOCK_JOB_DATA.salary,
          description: {
            ...MOCK_JOB_DATA.description,
            requirements: (postedJob.description || MOCK_JOB_DATA.description.requirements) + buildPostedJobExtras(postedJob),
            whatWeNeed: postedJob.skills
              ? `Required Skills: ${postedJob.skills}\n\nYears of Experience: ${postedJob.experience ?? 'Not specified'}`
              : MOCK_JOB_DATA.description.whatWeNeed,
          },
        }
      : MOCK_JOB_DATA

  const isOwnerView = getCurrentUserRole() === 'employer' && id === 'sample'
  const isCandidate = getCurrentUserRole() === 'candidate'

  const navigate = useNavigate()
  const [showSavedToast, setShowSavedToast] = useState(false)

  const handleApply = () => {
    navigate(`/job/${id}/application`)
  }

  const handleSaveJob = () => {
    // BACKEND DEV NOTE: POST /api/jobs/:id/save
    setShowSavedToast(true)
    setTimeout(() => setShowSavedToast(false), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[900px] w-full mx-auto px-6 py-8">
        {/* Job Title Section */}
        <JobTitle
          title={job.title}
          company={job.company}
          postedDate={job.postedDate}
        />

        {/* Action row — employer owner sees meta only; candidates see Apply + Save buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {!isOwnerView && <ApplyJob onClick={handleApply} />}
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-slate-600">
              <span className="font-medium">{job.location}</span>
              <span className="mx-2 text-slate-400">|</span>
              <span>{job.type}</span>
              <span className="mx-2 text-slate-400">|</span>
              <span className="text-green-600 font-medium">{job.salary}</span>
            </div>
            {isCandidate && <SaveJob onClick={handleSaveJob} />}
          </div>
        </div>

        {/* Candidates Applied — only visible to the employer who owns this listing */}
        {isOwnerView && (
          <section className="mt-8">
            <h2 className="text-[1.3rem] font-semibold text-slate-900 mb-1">Candidates Applied</h2>
            <p className="text-slate-600 mb-5">Applicants who have expressed interest in this role</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {MOCK_SAMPLE_APPLICANTS.map(c => (
                <CandidateCard key={c.id} candidate={c} />
              ))}
            </div>
          </section>
        )}

        {/* Job Details Section */}
        <div className="mt-6">
          <JobDetails description={job.description} />
        </div>
      </main>

      <Footer />

      {/* Job saved toast — candidate UI only, no persistence */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-white px-5 py-3.5 shadow-[0_4px_24px_rgba(15,23,42,0.15)] border border-slate-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="text-[0.95rem] font-semibold text-slate-800">Job saved</span>
        </div>
      )}
    </div>
  )
}

export default JobDescription
