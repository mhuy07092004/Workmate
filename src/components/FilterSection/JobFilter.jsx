/**
 * JobFilter.jsx — Filter component for job recommendations
 *
 * Provides advanced filtering options for job seekers:
 * - Text inputs: Location, Job Title, Company Name
 * - Dropdowns: Employment Type, Work Arrangement, Salary Range, etc.
 */

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

function JobFilter({ filters, onFilterChange, onClearFilters, showFilters, setShowFilters }) {
  const handleFilterChange = (key, value) => {
    onFilterChange(key, value)
  }

  return (
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
          <input
            type="text"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="Enter location..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

        <div>
          <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Job Title</label>
          <input
            type="text"
            value={filters.jobTitle}
            onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
            placeholder="Enter job title..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
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
            <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Company Name</label>
            <input
              type="text"
              value={filters.companyName}
              onChange={(e) => handleFilterChange('companyName', e.target.value)}
              placeholder="Enter company name..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

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
          onClick={onClearFilters}
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
  )
}

export default JobFilter
