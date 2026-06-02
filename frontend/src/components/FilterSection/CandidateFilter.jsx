/**
 * CandidateFilter.jsx — Filter component for candidate search (employer view)
 *
 * Provides search and filtering options for finding candidates:
 * - Text inputs: Keyword search (profile + resume), Location, Major/Field
 * - Dropdowns: Degree Type, Experience Level
 *
 * Keyword Search: Searches in candidate profile, resume, education, experience
 * Filters: Refine by location, education, experience level
 *
 * Props:
 *   variant        — 'page' (default card) | 'popover' (compact, no card shell)
 *   suppressFields — array of filter keys to hide
 */

const FILTER_OPTIONS = {
  experienceLevel: ['0-1 years', '1-2 years', '2-3 years', '3-5 years', '5+ years'],
  degreeType: ['High School', 'Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'],
  language: ['English', 'Vietnamese', 'Mandarin', 'Japanese', 'Korean', 'Spanish', 'French', 'German'],
  workArrangement: ['Remote', 'On Site', 'Hybrid', 'Flexible'],
  industry: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Media', 'Consulting', 'Manufacturing'],
  major: ['Computer Science', 'Software Engineering', 'Data Science', 'Information Technology', 'Business Administration', 'Marketing', 'Design', 'Engineering', 'Mathematics', 'Physics'],
  roleLevel: ['Intern', 'Fresher', 'Junior', 'Senior', 'Lead', 'Manager', 'Director'],
  sortBy: ['Most Relevant', 'Most Recent', 'Experience (High to Low)', 'Experience (Low to High)'],
}

const fieldClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
const labelClass = 'block text-[0.875rem] font-medium text-slate-700 mb-1.5'

function CandidateFilter({
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
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
    </>
  )

  return (
    <div className={isPopover ? '' : 'bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]'}>
      <div className={quickGridClass}>
        {/* KEYWORD SEARCH: Search in candidate profile + resume */}
        {!hide('keyword') && (
          <div>
            <label className={labelClass}>Keyword Search</label>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => onFilterChange('keyword', e.target.value)}
              placeholder="Search candidate profile..."
              className={fieldClass}
            />
            <p className="text-xs text-slate-500 mt-1">
              Searches candidate profile and resume
            </p>
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

        {!hide('major') && (
          <div>
            <label className={labelClass}>Major / Field of Study</label>
            <input
              type="text"
              value={filters.major}
              onChange={(e) => onFilterChange('major', e.target.value)}
              placeholder="Enter major or field..."
              list="major-options"
              className={fieldClass}
            />
            <datalist id="major-options">
              {FILTER_OPTIONS.major.map(opt => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          </div>
        )}
      </div>

      {/* Expanded filters section */}
      <details className={isPopover ? '' : ''}>
        <summary className={`text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-700 ${isPopover ? 'mb-3' : 'mb-4'}`}>
          {showFilters ? '▼ More Filters' : '▶ More Filters'}
        </summary>
        <div className={expandedGridClass}>
          {expandedFilterFields}
        </div>
      </details>

      {/* Action buttons */}
      <div className={actionsClass}>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}

export default CandidateFilter
