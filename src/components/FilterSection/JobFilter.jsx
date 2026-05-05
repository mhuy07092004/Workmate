/**
 * JobFilter.jsx — Filter component for job recommendations
 *
 * Provides advanced filtering options for job seekers:
 * - Text inputs: Location, Job Title, Company Name
 * - Dropdowns: Employment Type, Work Arrangement, Salary Range, etc.
 *
 * Props:
 *   variant        — 'page' (default card) | 'popover' (compact, no card shell)
 *   suppressFields — array of filter keys to hide (e.g. ['jobTitle'] when navbar
 *                    input already captures the job title query)
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

const fieldClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
const labelClass = 'block text-[0.875rem] font-medium text-slate-700 mb-1.5'

function JobFilter({
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
  setShowFilters,
  variant = 'page',
  suppressFields = [],
}) {
  const isPopover = variant === 'popover'
  const hide = (field) => suppressFields.includes(field)

  const quickGridClass = isPopover
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'

  const expandedGridClass = isPopover
    ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200'

  const actionsClass = isPopover
    ? 'flex gap-3 mt-3 pt-3 border-t border-slate-200'
    : 'flex gap-3 mt-4 pt-4 border-t border-slate-200'

  const expandedFilterFields = (
    <>
      {!hide('companyName') && (
        <div>
          <label className={labelClass}>Company Name</label>
          <input
            type="text"
            value={filters.companyName}
            onChange={(e) => onFilterChange('companyName', e.target.value)}
            placeholder="Enter company name..."
            className={fieldClass}
          />
        </div>
      )}

      {!hide('salaryRange') && (
        <div>
          <label className={labelClass}>Salary Range</label>
          <select
            value={filters.salaryRange}
            onChange={(e) => onFilterChange('salaryRange', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Salary</option>
            {FILTER_OPTIONS.salaryRange.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('jobCategory') && (
        <div>
          <label className={labelClass}>Job Category</label>
          <select
            value={filters.jobCategory}
            onChange={(e) => onFilterChange('jobCategory', e.target.value)}
            className={fieldClass}
          >
            <option value="">All Categories</option>
            {FILTER_OPTIONS.jobCategory.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('industry') && (
        <div>
          <label className={labelClass}>Industry</label>
          <select
            value={filters.industry}
            onChange={(e) => onFilterChange('industry', e.target.value)}
            className={fieldClass}
          >
            <option value="">All Industries</option>
            {FILTER_OPTIONS.industry.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('certification') && (
        <div>
          <label className={labelClass}>Certification Required</label>
          <select
            value={filters.certification}
            onChange={(e) => onFilterChange('certification', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Certification</option>
            {FILTER_OPTIONS.certification.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('language') && (
        <div>
          <label className={labelClass}>Language Required</label>
          <select
            value={filters.language}
            onChange={(e) => onFilterChange('language', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Language</option>
            {FILTER_OPTIONS.language.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('degree') && (
        <div>
          <label className={labelClass}>Required Degree</label>
          <select
            value={filters.degree}
            onChange={(e) => onFilterChange('degree', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Degree</option>
            {FILTER_OPTIONS.degree.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('dayPosted') && (
        <div>
          <label className={labelClass}>Day Posted</label>
          <select
            value={filters.dayPosted}
            onChange={(e) => onFilterChange('dayPosted', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Time</option>
            {FILTER_OPTIONS.dayPosted.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('experience') && (
        <div>
          <label className={labelClass}>Experience Required</label>
          <select
            value={filters.experience}
            onChange={(e) => onFilterChange('experience', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Experience</option>
            {FILTER_OPTIONS.experience.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('roleLevel') && (
        <div>
          <label className={labelClass}>Role Level</label>
          <select
            value={filters.roleLevel}
            onChange={(e) => onFilterChange('roleLevel', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Level</option>
            {FILTER_OPTIONS.roleLevel.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('sortBy') && (
        <div>
          <label className={labelClass}>Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className={fieldClass}
          >
            {FILTER_OPTIONS.sortBy.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
    </>
  )

  const body = (
    <>
      {/* Header */}
      <div className={`flex items-center justify-between ${isPopover ? 'mb-3' : 'mb-4'}`}>
        <h2 className={`font-semibold text-slate-900 ${isPopover ? 'text-[0.95rem]' : 'text-[1.2rem]'}`}>
          {isPopover ? 'Filters' : 'Advanced Filters'}
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 text-blue-700 font-medium hover:text-blue-800 transition-colors"
        >
          <span className="text-[0.875rem]">{showFilters ? 'Hide' : 'More Filters'}</span>
          <svg
            className={`transition-transform ${isPopover ? 'w-4 h-4' : 'w-5 h-5'} ${showFilters ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Quick filters */}
      <div className={quickGridClass}>
        {!hide('location') && (
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              placeholder="Enter location..."
              className={fieldClass}
            />
          </div>
        )}

        {!hide('jobTitle') && (
          <div>
            <label className={labelClass}>Job Title</label>
            <input
              type="text"
              value={filters.jobTitle}
              onChange={(e) => onFilterChange('jobTitle', e.target.value)}
              placeholder="Enter job title..."
              className={fieldClass}
            />
          </div>
        )}

        {!hide('employmentType') && (
          <div>
            <label className={labelClass}>Employment Type</label>
            <select
              value={filters.employmentType}
              onChange={(e) => onFilterChange('employmentType', e.target.value)}
              className={fieldClass}
            >
              <option value="">All Types</option>
              {FILTER_OPTIONS.employmentType.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {!hide('workArrangement') && (
          <div>
            <label className={labelClass}>Work Arrangement</label>
            <select
              value={filters.workArrangement}
              onChange={(e) => onFilterChange('workArrangement', e.target.value)}
              className={fieldClass}
            >
              <option value="">All Arrangements</option>
              {FILTER_OPTIONS.workArrangement.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Expanded filters — popover (navbar): animated height; page: mount only when open */}
      {isPopover ? (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
            showFilters ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className={expandedGridClass} inert={!showFilters ? true : undefined}>
              {expandedFilterFields}
            </div>
          </div>
        </div>
      ) : (
        showFilters && (
          <div className={expandedGridClass}>
            {expandedFilterFields}
          </div>
        )
      )}

      {/* Filter actions */}
      <div className={actionsClass}>
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
    </>
  )

  if (isPopover) {
    return <div className="px-4 py-4">{body}</div>
  }

  return (
    <section className="bg-white rounded-[14px] px-6 py-6 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
      {body}
    </section>
  )
}

export default JobFilter
