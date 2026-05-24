/**
 * CandidateFilter.jsx — Filter component for candidate recommendations (employer view)
 *
 * Provides advanced filtering options for finding candidates:
 * - Text inputs: Candidate Name, Location, Major/Field of Study
 * - Dropdowns: Experience Level, Degree Type, Certification, Language, etc.
 *
 * Props:
 *   variant        — 'page' (default card) | 'popover' (compact, no card shell)
 *   suppressFields — array of filter keys to hide (e.g. ['candidateName'] when
 *                    navbar input already captures the candidate name query)
 */

const FILTER_OPTIONS = {
  experienceLevel: ['0-1 years', '1-2 years', '2-3 years', '3-5 years', '5+ years'],
  degreeType: ['High School', 'Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'],
  certification: ['AWS Certified', 'Azure Certified', 'Google Cloud', 'PMP', 'Scrum Master', 'CISSP', 'CompTIA A+', 'None'],
  language: ['English', 'Vietnamese', 'Mandarin', 'Japanese', 'Korean', 'Spanish', 'French', 'German'],
  workArrangement: ['Remote', 'On Site', 'Hybrid', 'Flexible'],
  industry: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Media', 'Consulting', 'Manufacturing'],
  major: ['Computer Science', 'Software Engineering', 'Data Science', 'Information Technology', 'Business Administration', 'Marketing', 'Design', 'Engineering', 'Mathematics', 'Physics'],
  roleLevel: ['Intern', 'Fresher', 'Junior', 'Senior', 'Lead', 'Manager', 'Director'],
  availability: ['Immediately', '2 weeks', '1 month', '2 months', '3+ months'],
  sortBy: ['Most Relevant', 'Most Recent', 'Experience (High to Low)', 'Experience (Low to High)'],
}

const fieldClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
const labelClass = 'block text-[0.875rem] font-medium text-slate-700 mb-1.5'

function CandidateFilter({
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
      {!hide('major') && (
        <div>
          <label className={labelClass}>Major / Field of Study</label>
          <input
            type="text"
            value={filters.major}
            onChange={(e) => onFilterChange('major', e.target.value)}
            placeholder="Enter major or field..."
            className={fieldClass}
          />
        </div>
      )}

      {!hide('certification') && (
        <div>
          <label className={labelClass}>Certification</label>
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
          <label className={labelClass}>Language</label>
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

      {!hide('workArrangement') && (
        <div>
          <label className={labelClass}>Work Arrangement</label>
          <select
            value={filters.workArrangement}
            onChange={(e) => onFilterChange('workArrangement', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Arrangement</option>
            {FILTER_OPTIONS.workArrangement.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {!hide('industry') && (
        <div>
          <label className={labelClass}>Industry Experience</label>
          <select
            value={filters.industry}
            onChange={(e) => onFilterChange('industry', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Industry</option>
            {FILTER_OPTIONS.industry.map(opt => (
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

      {!hide('availability') && (
        <div>
          <label className={labelClass}>Availability</label>
          <select
            value={filters.availability}
            onChange={(e) => onFilterChange('availability', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Time</option>
            {FILTER_OPTIONS.availability.map(opt => (
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
        {!hide('candidateName') && (
          <div>
            <label className={labelClass}>Candidate Name</label>
            <input
              type="text"
              value={filters.candidateName}
              onChange={(e) => onFilterChange('candidateName', e.target.value)}
              placeholder="Enter candidate name..."
              className={fieldClass}
            />
          </div>
        )}

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

        {!hide('experienceLevel') && (
          <div>
            <label className={labelClass}>Experience Level</label>
            <select
              value={filters.experienceLevel}
              onChange={(e) => onFilterChange('experienceLevel', e.target.value)}
              className={fieldClass}
            >
              <option value="">Any Experience</option>
              {FILTER_OPTIONS.experienceLevel.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {!hide('degreeType') && (
          <div>
            <label className={labelClass}>Degree Type</label>
            <select
              value={filters.degreeType}
              onChange={(e) => onFilterChange('degreeType', e.target.value)}
              className={fieldClass}
            >
              <option value="">Any Degree</option>
              {FILTER_OPTIONS.degreeType.map(opt => (
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

export default CandidateFilter
