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

// Sample data for saved jobs
const savedJobs = [
  {
    id: 1,
    title: 'Fresher Fronrestend Developer',
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

function Applications() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation/Header */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1120px] mx-auto px-6 py-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
            <p className="text-slate-600">Manage your saved jobs and application history</p>
          </div>

          {/* Save Jobs Section */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Saved Jobs</h2>
              <p className="text-slate-600">Jobs you've saved for later review</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>

          {/* Jobs Applied Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Jobs Applied</h2>
              <p className="text-slate-600">Track your job application status</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appliedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
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