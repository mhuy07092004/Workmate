/**
 * CandidateFilter.jsx — Filter component for candidate recommendations (employer view)
 *
 * Provides advanced filtering options for finding candidates:
 * - Text inputs: Candidate Name, Location, Major/Field of Study
 * - Dropdowns: Experience Level, Degree Type, Certification, Language, etc.
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

function CandidateFilter({ filters, onFilterChange, onClearFilters, showFilters, setShowFilters }) {
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
          <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Candidate Name</label>
          <input
            type="text"
            value={filters.candidateName}
            onChange={(e) => handleFilterChange('candidateName', e.target.value)}
            placeholder="Enter candidate name..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
        </div>

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
          <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Experience Level</label>
          <select
            value={filters.experienceLevel}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">Any Experience</option>
            {FILTER_OPTIONS.experienceLevel.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Degree Type</label>
          <select
            value={filters.degreeType}
            onChange={(e) => handleFilterChange('degreeType', e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          >
            <option value="">Any Degree</option>
            {FILTER_OPTIONS.degreeType.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
          <div>
            <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Major / Field of Study</label>
            <input
              type="text"
              value={filters.major}
              onChange={(e) => handleFilterChange('major', e.target.value)}
              placeholder="Enter major or field..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Certification</label>
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
            <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Language</label>
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
            <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Work Arrangement</label>
            <select
              value={filters.workArrangement}
              onChange={(e) => handleFilterChange('workArrangement', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="">Any Arrangement</option>
              {FILTER_OPTIONS.workArrangement.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Industry Experience</label>
            <select
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="">Any Industry</option>
              {FILTER_OPTIONS.industry.map(opt => (
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
            <label className="block text-[0.875rem] font-medium text-slate-700 mb-1.5">Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.9rem] text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="">Any Time</option>
              {FILTER_OPTIONS.availability.map(opt => (
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

export default CandidateFilter
