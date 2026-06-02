/**
 * JobFilter.jsx — Filter component for job recommendations
 *
 * Provides search and filtering options for job seekers:
 * - Text inputs: Keyword search (description + requirements), Location, Company Name
 * - Dropdowns: Employment Type, Salary Range
 *
 * Keyword Search: Searches in job description and requirements (with fuzzy matching)
 * Filters: Refine by location, salary, employment type, company
 *
 * Props:
 *   variant        — 'page' (default card) | 'popover' (compact, no card shell)
 *   suppressFields — array of filter keys to hide
 *   onSearch       — callback fired when the user clicks "Search" (used by Dashboard)
 *   onClearFilters — optional callback to clear all filters
 *   isSearching    — boolean, shows loading state on the Search button
 */
import { EMPLOYMENT_TYPES } from '../../services/jobStore.js'

const FILTER_OPTIONS = {
  location: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  salaryRange: ['$50k - $70k', '$70k - $100k', '$100k - $150k', '$150k - $200k', '$200k+'],
  employmentType: EMPLOYMENT_TYPES,
  companyName: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Canva', 'WiseTech', 'Xero', 'Afterpay'],
}

const fieldClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
const labelClass = 'block text-[0.875rem] font-medium text-slate-700 mb-1.5'

function JobFilter({
  filters,
  onFilterChange,
  onClearFilters,
  onSearch,
  variant = 'page',
  suppressFields = [],
  isSearching = false,
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) onSearch()
  }

  const expandedFilterFields = (
    <>
      {!hide('companyName') && (
        <div>
          <label className={labelClass}>Company Name</label>
          <input
            type="text"
            value={filters.companyName}
            onChange={(e) => onFilterChange('companyName', e.target.value)}
            onKeyDown={handleKeyDown}
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

      {!hide('employmentType') && (
        <div>
          <label className={labelClass}>Employment Type</label>
          <select
            value={filters.employmentType}
            onChange={(e) => onFilterChange('employmentType', e.target.value)}
            className={fieldClass}
          >
            <option value="">Any Type</option>
            {FILTER_OPTIONS.employmentType.map(opt => (
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
        {!hide('keyword') && (
          <div>
            <label className={labelClass}>Keyword Search</label>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => onFilterChange('keyword', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search job description..."
              className={fieldClass}
            />
            <p className="text-xs text-slate-500 mt-1">
              Searches in job descriptions and requirements
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
              onKeyDown={handleKeyDown}
              placeholder="Enter location..."
              list="location-options"
              className={fieldClass}
            />
            <datalist id="location-options">
              {FILTER_OPTIONS.location.map(opt => (
                <option key={opt} value={opt} />
              ))}
            </datalist>
          </div>
        )}
      </div>

      <details className="mb-0">
        <summary className={`text-sm font-medium text-blue-600 cursor-pointer select-none hover:text-blue-700 ${isPopover ? 'mb-3' : 'mb-4'}`}>
          More Filters
        </summary>
        <div className={expandedGridClass}>
          {expandedFilterFields}
        </div>
      </details>

      <div className={actionsClass}>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Clear All
          </button>
        )}

        {onSearch && (
          <button
            type="button"
            onClick={onSearch}
            disabled={isSearching}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Searching…' : 'Search'}
          </button>
        )}
      </div>
    </div>
  )
}

export default JobFilter