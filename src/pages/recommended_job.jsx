/**
 * recommended_job.jsx — Recommended Jobs page
 *
 * Features:
 *   - Advanced filter section with multiple dropdown filters
 *   - Three job recommendation sections with show more/less toggle
 *   - Layout with Contact sidebar, main content, and Footer
 */
import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import Contact from '../components/Contact/Contact.jsx'
import JobCard from '../components/JobCard/JobCard.jsx'
import JobFilter from '../components/FilterSection/JobFilter.jsx'

// Mock data for "Chosen By Workmate A.I" section
const AI_CHOSEN_JOBS = [
  { id: 1, title: 'Senior Software Engineer', company: 'Google', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 2 days ago' },
  { id: 2, title: 'Data Scientist', company: 'Amazon', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 3 days ago' },
  { id: 3, title: 'Product Manager', company: 'Atlassian', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 1 week ago' },
  { id: 4, title: 'UX Designer', company: 'Canva', type: 'Hybrid', location: 'Sydney, NSW', postedTime: 'Posted 5 days ago' },
  { id: 5, title: 'DevOps Engineer', company: 'Microsoft', type: 'Full Time', location: 'Brisbane, QLD', postedTime: 'Posted 1 day ago' },
  { id: 6, title: 'Frontend Developer', company: 'WiseTech', type: 'Contract', location: 'Sydney, NSW', postedTime: 'Posted 4 days ago' },
  { id: 7, title: 'Machine Learning Engineer', company: 'Meta', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 1 week ago' },
  { id: 8, title: 'Backend Developer', company: 'Afterpay', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 3 days ago' },
  { id: 9, title: 'Cloud Architect', company: 'AWS', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 2 days ago' },
  { id: 10, title: 'Mobile Developer', company: 'REA Group', type: 'Part Time', location: 'Melbourne, VIC', postedTime: 'Posted 6 days ago' },
  { id: 11, title: 'Security Engineer', company: 'Commonwealth Bank', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 1 week ago' },
  { id: 12, title: 'Full Stack Developer', company: 'Xero', type: 'Hybrid', location: 'Wellington, NZ', postedTime: 'Posted 4 days ago' },
]

// Mock data for "Based on Viewed Jobs" section
const VIEWED_JOBS = [
  { id: 101, title: 'Junior Web Developer', company: 'Workmate Solutions', type: 'Part Time', location: 'Sydney, NSW', postedTime: 'Posted 3 weeks ago' },
  { id: 102, title: 'React Developer', company: 'AirTasker', type: 'Contract', location: 'Sydney, NSW', postedTime: 'Posted 2 weeks ago' },
  { id: 103, title: 'JavaScript Engineer', company: 'Zip Co', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 5 days ago' },
  { id: 104, title: 'Node.js Developer', company: 'Nine Entertainment', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 1 week ago' },
  { id: 105, title: 'Vue.js Developer', company: 'Linktree', type: 'Hybrid', location: 'Melbourne, VIC', postedTime: 'Posted 3 days ago' },
  { id: 106, title: 'TypeScript Developer', company: 'SafetyCulture', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 4 days ago' },
  { id: 107, title: 'Angular Developer', company: 'MYOB', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 1 week ago' },
  { id: 108, title: 'PHP Developer', company: 'Culture Amp', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 2 weeks ago' },
  { id: 109, title: 'Python Developer', company: 'Sendle', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 3 days ago' },
  { id: 110, title: 'Ruby Developer', company: 'Envato', type: 'Remote', location: 'Remote', postedTime: 'Posted 1 week ago' },
  { id: 111, title: 'Go Developer', company: 'Campaign Monitor', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 5 days ago' },
  { id: 112, title: 'Rust Developer', company: 'Fastmail', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 2 weeks ago' },
]

// Mock data for "Related Roles" section
const RELATED_JOBS = [
  { id: 201, title: 'QA Engineer', company: 'Atlassian', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 1 week ago' },
  { id: 202, title: 'Test Automation Engineer', company: 'ANZ', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 4 days ago' },
  { id: 203, title: 'Site Reliability Engineer', company: 'Netflix', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 3 days ago' },
  { id: 204, title: 'Platform Engineer', company: 'Spotify', type: 'Hybrid', location: 'Sydney, NSW', postedTime: 'Posted 1 week ago' },
  { id: 205, title: 'Infrastructure Engineer', company: 'Westpac', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 5 days ago' },
  { id: 206, title: 'Systems Administrator', company: 'NAB', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 2 weeks ago' },
  { id: 207, title: 'Network Engineer', company: 'Optus', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 1 week ago' },
  { id: 208, title: 'Database Administrator', company: 'Telstra', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 3 days ago' },
  { id: 209, title: 'Technical Support Engineer', company: 'IBM', type: 'Contract', location: 'Brisbane, QLD', postedTime: 'Posted 4 days ago' },
  { id: 210, title: 'IT Support Specialist', company: 'Accenture', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 1 week ago' },
  { id: 211, title: 'Business Analyst', company: 'Deloitte', type: 'Full Time', location: 'Sydney, NSW', postedTime: 'Posted 2 days ago' },
  { id: 212, title: 'Technical Project Manager', company: 'PWC', type: 'Full Time', location: 'Melbourne, VIC', postedTime: 'Posted 1 week ago' },
]

function RecommendedJob() {
  const [filters, setFilters] = useState({
    location: '',
    salaryRange: '',
    jobCategory: '',
    industry: '',
    jobTitle: '',
    employmentType: '',
    companyName: '',
    workArrangement: '',
    certification: '',
    language: '',
    degree: '',
    dayPosted: '',
    experience: '',
    roleLevel: '',
    sortBy: 'Most Recent',
  })

  const [showFilters, setShowFilters] = useState(false)

  const [visibleCounts, setVisibleCounts] = useState({
    aiChosen: 6,
    viewed: 6,
    related: 6,
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      location: '',
      salaryRange: '',
      jobCategory: '',
      industry: '',
      jobTitle: '',
      employmentType: '',
      companyName: '',
      workArrangement: '',
      certification: '',
      language: '',
      degree: '',
      dayPosted: '',
      experience: '',
      roleLevel: '',
      sortBy: 'Most Recent',
    })
  }

  const handleShowMore = (section) => {
    const dataMap = {
      aiChosen: AI_CHOSEN_JOBS,
      viewed: VIEWED_JOBS,
      related: RELATED_JOBS,
    }
    setVisibleCounts(prev => ({
      ...prev,
      [section]: Math.min(prev[section] + 6, dataMap[section].length),
    }))
  }

  const handleShowLess = (section) => {
    setVisibleCounts(prev => ({ ...prev, [section]: 6 }))
  }

  const renderJobSection = (title, jobs, visibleCount, sectionKey) => {
    const displayedJobs = jobs.slice(0, visibleCount)
    const hasMore = visibleCount < jobs.length
    const hasLess = visibleCount > 6

    return (
      <section className="mb-10">
        <div className="mb-6">
          <h2 className="text-[1.4rem] font-semibold text-slate-900 mb-2">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {displayedJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
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
      </section>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8 flex gap-6 items-start">
        <Contact />

        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Page Header */}
          <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
            <h1 className="mb-2.5 text-[1.6rem] text-slate-900 font-semibold">Recommended Jobs</h1>
            <p className="text-slate-600 leading-relaxed">
              Discover personalized job opportunities curated just for you. Use the filters below to refine your search.
            </p>
          </section>

          {/* Advanced Filter Section */}
          <JobFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Job Sections */}
          {renderJobSection('Chosen By Workmate A.I', AI_CHOSEN_JOBS, visibleCounts.aiChosen, 'aiChosen')}
          {renderJobSection('Based on Viewed Jobs', VIEWED_JOBS, visibleCounts.viewed, 'viewed')}
          {renderJobSection('Related Roles', RELATED_JOBS, visibleCounts.related, 'related')}
        </div>

        <div className="w-[240px] shrink-0 hidden xl:block" />
      </main>

      <Footer />
    </div>
  )
}

export default RecommendedJob
