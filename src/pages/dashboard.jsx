/**
 * dashboard.jsx — Main dashboard (root route)
 *
 * Accessible to all users. The Navbar conditionally shows a user icon
 * (signed in) or a "Join Now" button (signed out) based on localStorage.
 *
 * Planned sections (to be built out):
 *   - Recommendation: personalised job/talent suggestions from the matching engine
 *   - Applications:   candidate application tracker / employer applicant list
 *   - Help:           support articles and contact options
 *
 * TODO (backend integration):
 *   - Read the current user from AuthContext (or equivalent) to personalise the greeting
 *   - Fetch recommendation and application data from the API on mount
 */
import { useState } from 'react'
import Footer from '../components/Footer/Footer.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import JobCard from '../components/JobCard/JobCard.jsx'

// Mock job data
const MOCK_JOBS = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  title: 'Fresher Frontend Developer',
  company: 'Workmate Solutions',
  type: 'Part Time',
  location: 'Sydney, NSW',
  postedTime: 'Posted 3 weeks ago'
}))

function Dashboard() {
  const [visibleJobs, setVisibleJobs] = useState(6)

  const handleShowMore = () => {
    setVisibleJobs(prev => Math.min(prev + 6, MOCK_JOBS.length))
  }

  const displayedJobs = MOCK_JOBS.slice(0, visibleJobs)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top navigation bar — shared across all authenticated pages */}
      <Navbar />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-8 flex flex-col gap-8">
        {/* Welcome banner */}
        <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
          <h1 className="mb-2.5 text-[1.6rem] text-slate-900">Welcome to Workmate Dashboard</h1>
          <p className="text-slate-600 leading-relaxed">
            You are signed in successfully. Use navigation above to browse recommendations,
            applications, and support resources.
          </p>
        </section>

        {/* Recommendation Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">Recommended Jobs</h2>
            <p className="text-slate-600">Personalized job recommendations based on your profile and preferences</p>
          </div>
          
          {/* Job cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {displayedJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {/* Show More button */}
          {visibleJobs < MOCK_JOBS.length && (
            <div className="flex justify-center">
              <button
                onClick={handleShowMore}
                className="cursor-pointer rounded-full border-0 bg-blue-700 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-blue-600 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
              >
                Show More Jobs
              </button>
            </div>
          )}
        </section>

        {/* Hiring News Section */}
        <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
          <div className="mb-4">
            <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">Hiring News</h2>
            <p className="text-slate-600">Stay updated with the latest hiring trends and company news</p>
          </div>
          <div className="text-center py-8 text-slate-400">
            <p>Hiring news content will be available soon</p>
          </div>
        </section>

        {/* Posts Section */}
        <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
          <div className="mb-4">
            <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">Posts</h2>
            <p className="text-slate-600">Connect with professionals and share insights</p>
          </div>
          <div className="text-center py-8 text-slate-400">
            <p>Posts content will be available soon</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
