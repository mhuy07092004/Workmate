/**
 * applications.jsx — Job applications management page
 *
 * Displays two main sections:
 * - Save Jobs: Shows saved job listings using JobCard components
 * - Jobs Applied: Shows applied job listings using JobCard components
 */

import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import JobCard from '../components/JobCard/JobCard'
import CandidateCard from '../components/CandidateCard/CandidateCard'
import { getCurrentUserRole } from '../services/userService.js'

// Sample data for saved jobs
const savedJobs = [
  {
    id: 1,
    title: 'Fresher Frontend Developer',
    company: 'TechCorp',
    type: 'Full-time',
    location: 'Sydeny,NSW',
    postedTime: 'Posted 2 days ago'
  },
  {
    id: 2,
    title: 'React Developer',
    company: 'StartupXYZ',
    type: 'Full-time',
    location: 'Remote',
    postedTime: 'Posted 1 week ago'
  },
  {
    id: 3,
    title: 'UI/UX Engineer',
    company: 'DesignHub',
    type: 'Contract',
    location: 'Melbourne,VIC',
    postedTime: 'Posted 3 days ago'
  }
]

// Sample data for applied jobs
const appliedJobs = [
  {
    id: 4,
    title: 'Full Stack Developer',
    company: 'Innovation Labs',
    type: 'Full-time',
    location: 'Perth,WA',
    postedTime: 'Posted 1 day ago'
  },
  {
    id: 5,
    title: 'JavaScript Developer',
    company: 'WebSolutions',
    type: 'Full-time',
    location: 'Sydney, NSW',
    postedTime: 'Posted 4 days ago'
  }
]

// Sample data for saved candidates (employer view)
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
  const isEmployer = userRole === 'employer'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation/Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1120px] mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isEmployer ? 'Applicants' : 'My Applications'}
            </h1>
            {!isEmployer && (
              <p className="text-slate-600">Manage your saved jobs and application history</p>
            )}
          </div>

          {/* Saved Jobs / Your Posted Job Section */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                {isEmployer ? 'Your Posted Job' : 'Saved Jobs'}
              </h2>
              <p className="text-slate-600">
                {isEmployer ? 'Jobs you have posted for applicants' : "Jobs you've saved for later review"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>

          {/* Jobs Applied / Saved Candidates Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                {isEmployer ? 'Saved Candidates' : 'Jobs Applied'}
              </h2>
              <p className="text-slate-600">
                {isEmployer ? 'Candidates you have saved for review' : 'Track your job application status'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isEmployer ? (
                savedCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))
              ) : (
                appliedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Applications