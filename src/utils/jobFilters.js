/**
 * jobFilters.js — Pure filter helpers for job listings
 *
 * matchesJobFilters(job, filters) returns true when the job satisfies ALL
 * active filter criteria.
 *
 * Rules:
 *  - A filter is "active" only when its value is a non-empty string.
 *  - Text fields (location, jobTitle, companyName) use case-insensitive substring match.
 *  - Enum fields (employmentType, workArrangement, degree) require exact match.
 *  - experience: filter value is a string like "0 years", "4+ years"; job.experience
 *    is a raw number.  See parseExperienceFilter for the mapping.
 *  - If a job object is missing a field that an active filter targets, the job is
 *    NOT excluded — the filter is simply skipped for that job.  This keeps legacy
 *    mock data (which may lack salary, industry, etc.) visible while still filtering
 *    jobs that do carry the field.
 */

/**
 * Education degree map: form label (educationLevel) → filter label (degree).
 * Used when checking filters.degree against job.educationLevel.
 */
const EDUCATION_TO_DEGREE = {
  'High School': 'High School',
  'Associate Degree': 'Diploma',
  "Bachelor's Degree": 'BSc',
  "Master's Degree": 'MS',
  'PhD': 'Dr',
  'No specific education required': '',
}

/**
 * Parse the filter "experience" string to a minimum-years number.
 * e.g. "0 years" → 0, "1 year" → 1, "4+ years" → 4
 * Returns null if the string doesn't match any known pattern.
 */
function parseExperienceFilter(str) {
  if (!str) return null
  const match = str.match(/^(\d+)\+?\s*years?$/)
  return match ? Number(match[1]) : null
}

/**
 * True when job matches every active filter in the filters object.
 */
export function matchesJobFilters(job, filters) {
  // --- text: location ---
  if (filters.location) {
    const loc = job.location || ''
    if (!loc.toLowerCase().includes(filters.location.toLowerCase())) return false
  }

  // --- text: job title ---
  if (filters.jobTitle) {
    const title = job.title || ''
    if (!title.toLowerCase().includes(filters.jobTitle.toLowerCase())) return false
  }

  // --- text: company name ---
  if (filters.companyName) {
    const company = job.company || ''
    if (!company.toLowerCase().includes(filters.companyName.toLowerCase())) return false
  }

  // --- enum: employment type ---
  if (filters.employmentType && job.employmentType !== undefined) {
    // Support legacy job.type as fallback
    const jobType = job.employmentType || job.type || ''
    if (jobType !== filters.employmentType) return false
  }

  // --- enum: work arrangement ---
  if (filters.workArrangement && job.workArrangement !== undefined) {
    if (job.workArrangement !== filters.workArrangement) return false
  }

  // --- enum: degree (mapped from educationLevel) ---
  if (filters.degree && job.educationLevel !== undefined) {
    const mappedDegree = EDUCATION_TO_DEGREE[job.educationLevel] ?? ''
    if (mappedDegree !== filters.degree) return false
  }

  // --- numeric: experience ---
  if (filters.experience && job.experience !== undefined) {
    const minYears = parseExperienceFilter(filters.experience)
    if (minYears !== null && job.experience < minYears) return false
  }

  // Fields that exist on some jobs but not others (salary, industry, jobCategory,
  // certification, language, roleLevel, dayPosted, sortBy): skip when the job
  // object does not carry the field, so legacy mocks remain visible.

  return true
}
