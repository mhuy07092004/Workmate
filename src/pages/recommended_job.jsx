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

// Filter options
const FILTER_OPTIONS = {
  location: ['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD', 'Perth, WA', 'Adelaide, SA', 'Remote'],
  salaryRange: ['$50k - $70k', '$70k - $100k', '$100k - $150k', '$150k - $200k', '$200k+'],
  jobCategory: ['Software Engineering', 'Data Science', 'Product Management', 'UX/UI Design', 'DevOps', 'QA/Testing'],
  industry: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Media', 'Consulting'],
  jobTitle: ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Frontend Developer', 'Backend Developer'],
  employmentType: ['Casual', 'Part Time', 'Contract', 'Full Time'],
  companyName: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Canva', 'WiseTech', 'Xero', 'Afterpay'],
  workArrangement: ['Remote', 'On Site', 'Hybrid'],
  certification: ['AWS', 'Azure', 'GCP', 'PMP', 'Scrum Master', 'None'],
  language: ['English', 'Vietnamese', 'Mandarin', 'Japanese', 'Korean', 'Spanish'],
  degree: ['High School', 'BSc', 'MS', 'Dr', 'Diploma', 'Certificate'],
  dayPosted: ['Today', 'This Week', 'Last 2 Weeks', 'Last Month', 'Any Time'],
  experience: ['0 years', '1 year', '2 years', '3 years', '4+ years'],
  roleLevel: ['Intern', 'Fresher', 'Junior', 'Senior', 'Lead', 'Manager'],
  sortBy: ['Most Recent', 'Most Relevant', 'Salary (High to Low)', 'Salary (Low to High)'],
}

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
          <section className="bg-white rounded-[14px] px-6 py-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[1.2rem] font-semibold text-slate-900">Advanced Filters</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800 transition-colors"
              >
                <span>{showFilters ? 'Hide Filters' : 'Show All Filters'}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Always visible: Quick filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="">All Locations</option>
                  {FILTER_OPTIONS.location.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Job Title</label>
                <select
                  value={filters.jobTitle}
                  onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="">All Titles</option>
                  {FILTER_OPTIONS.jobTitle.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Employment Type</label>
                <select
                  value={filters.employmentType}
                  onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="">All Types</option>
                  {FILTER_OPTIONS.employmentType.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Work Arrangement</label>
                <select
                  value={filters.workArrangement}
                  onChange={(e) => handleFilterChange('workArrangement', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="">All Arrangements</option>
                  {FILTER_OPTIONS.workArrangement.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expanded filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Salary Range</label>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">Any Salary</option>
                    {FILTER_OPTIONS.salaryRange.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Job Category</label>
                  <select
                    value={filters.jobCategory}
                    onChange={(e) => handleFilterChange('jobCategory', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">All Categories</option>
                    {FILTER_OPTIONS.jobCategory.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">All Industries</option>
                    {FILTER_OPTIONS.industry.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Company Name</label>
                  <select
                    value={filters.companyName}
                    onChange={(e) => handleFilterChange('companyName', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">All Companies</option>
                    {FILTER_OPTIONS.companyName.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Certification Required</label>
                  <select
                    value={filters.certification}
                    onChange={(e) => handleFilterChange('certification', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">Any Certification</option>
                    {FILTER_OPTIONS.certification.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Language Required</label>
                  <select
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">Any Language</option>
                    {FILTER_OPTIONS.language.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Required Degree</label>
                  <select
                    value={filters.degree}
                    onChange={(e) => handleFilterChange('degree', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">Any Degree</option>
                    {FILTER_OPTIONS.degree.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Day Posted</label>
                  <select
                    value={filters.dayPosted}
                    onChange={(e) => handleFilterChange('dayPosted', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">Any Time</option>
                    {FILTER_OPTIONS.dayPosted.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Experience Required</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">Any Experience</option>
                    {FILTER_OPTIONS.experience.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Role Level</label>
                  <select
                    value={filters.roleLevel}
                    onChange={(e) => handleFilterChange('roleLevel', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">Any Level</option>
                    {FILTER_OPTIONS.roleLevel.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  >
                    {FILTER_OPTIONS.sortBy.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Filter actions */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={() => setFilters({
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
                })}
                className="cursor-pointer rounded-full border border-slate-300 bg-white px-[22px] py-[9px] text-[0.92rem] font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Clear All Filters
              </button>
              <button
                className="cursor-pointer rounded-full border-0 bg-blue-700 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-blue-600 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
              >
                Apply Filters
              </button>
            </div>
          </section>

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
