/**
 * jobStore.js — Shared job constants and localStorage persistence
 *
 * Single source of truth for:
 *   - EMPLOYMENT_TYPES / WORK_ARRANGEMENTS  (used by post_job form AND JobFilter)
 *   - EDUCATION_LEVELS                      (form dropdown)
 *   - JOB_CERTIFICATIONS                   (form + JobFilter, with "No certification required")
 *   - JOB_INDUSTRIES                        (form + JobFilter)
 *   - ROLE_LEVELS                           (form + JobFilter)
 *   - PREFERRED_LANGUAGES                   (form + JobFilter)
 *   - AVAILABILITY_MODES                    (form dropdown, availability start)
 *   - appendPostedJob / getPostedJobs       (localStorage, key workmate_posted_jobs)
 *   - normalizePostedJob                    (maps raw form data → canonical job object)
 *
 * The canonical job object shape expected by JobCard and JobFilter:
 * {
 *   id                  : number | string,
 *   title               : string,
 *   company             : string,          // short display name
 *   employmentType      : string,          // one of EMPLOYMENT_TYPES
 *   workArrangement     : string,          // one of WORK_ARRANGEMENTS
 *   location            : string,
 *   postedTime          : string,          // human-readable, e.g. "Posted just now"
 *   // optional — present when available
 *   salary              : string,          // e.g. "$100k - $150k"
 *   experience          : number,          // years (raw number from form)
 *   educationLevel      : string,          // from EDUCATION_LEVELS
 *   description         : string,
 *   skills              : string,
 *   // new fields added by post_job form
 *   certification       : string,          // from JOB_CERTIFICATIONS
 *   major               : string,          // free text, e.g. "Computer Science"
 *   industry            : string,          // from JOB_INDUSTRIES
 *   roleLevel           : string,          // from ROLE_LEVELS
 *   preferredLanguages  : string[],        // subset of PREFERRED_LANGUAGES
 *   availability        : { mode: string, date: string|null }, // mode from AVAILABILITY_MODES
 * }
 */
// "Full-time", "Contract", "Remote", "Hybrid"
export const EMPLOYMENT_TYPES = ["Full-time", "Contract", "Remote", "Hybrid"]

export const WORK_ARRANGEMENTS = ['Remote', 'On Site', 'Hybrid']

export const EDUCATION_LEVELS = [
  'High School',
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'No specific education required',
]

export const JOB_CERTIFICATIONS = [
  'No certification required',
  'AWS',
  'Azure',
  'GCP',
  'PMP',
  'Scrum Master',
  'CISSP',
  'CompTIA A+',
  'CPA',
  'Other',
]

export const JOB_INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Media & Entertainment',
  'Consulting',
  'Manufacturing',
  'Real Estate',
  'Other',
]

export const ROLE_LEVELS = ['Intern', 'Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Manager', 'Director']

export const PREFERRED_LANGUAGES = [
  'English',
  'Vietnamese',
  'Mandarin',
  'Japanese',
  'Korean',
  'Spanish',
  'French',
  'German',
]

export const AVAILABILITY_MODES = [
  'Immediately',
  'Within 2 weeks',
  'Next month',
  'Within 3 months',
  'Specific date',
]

const STORAGE_KEY = 'workmate_posted_jobs'

/**
 * Derive a short company name from the companyInfo field.
 * If the user typed "Acme Inc. - Great place to work", we strip everything
 * from " - " onward so the card shows "Acme Inc." only.
 */
function deriveCompanyName(companyInfo) {
  if (!companyInfo) return 'Unknown Company'
  const dashIdx = companyInfo.indexOf(' - ')
  return dashIdx !== -1 ? companyInfo.slice(0, dashIdx).trim() : companyInfo.trim()
}

/**
 * Map raw post_job form data to the canonical job object.
 */
export function normalizePostedJob(formData) {
  return {
    id: Date.now(),
    title: formData.jobTitle.trim(),
    company: deriveCompanyName(formData.companyName || formData.companyInfo),
    employmentType: formData.employmentType,
    workArrangement: formData.workArrangement,
    location: formData.jobLocation.trim(),
    postedTime: 'Posted just now',
    salary: formData.salary || '',
    experience: Number(formData.yearsOfExperience) || 0,
    educationLevel: formData.educationLevel,
    description: formData.jobDescription,
    skills: formData.requiredSkills,
    certification: formData.requiredCertification,
    major: formData.majorField.trim(),
    industry: formData.industry,
    roleLevel: formData.roleLevel,
    preferredLanguages: [...(formData.preferredLanguages || [])],
    availability: {
      mode: formData.availabilityMode,
      date: formData.availabilityMode === 'Specific date' ? (formData.availabilityDate || null) : null,
    },
  }
}

/** Append a normalized job to localStorage. */
export function appendPostedJob(job) {
  const existing = getPostedJobs()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, job]))
}

/** Read all employer-posted jobs from localStorage. */
export function getPostedJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Look up a single job (from posted store) by id. */
export function getPostedJobById(id) {
  const numId = Number(id)
  return getPostedJobs().find(j => j.id === numId || j.id === id) || null
}

/** Clear all posted jobs (useful for testing). */
export function clearPostedJobs() {
  localStorage.removeItem(STORAGE_KEY)
}

export function formatSalaryFromApi(job) {
  if (job.salary) return job.salary
  if (job.salary_min && job.salary_max) {
    return job.salary_min === job.salary_max
      ? `$${job.salary_min}`
      : `$${job.salary_min} - $${job.salary_max}`
  }
  return ''
}

export function normalizeApiJob(job) {
  if (!job) return null

  // Parse requirements if it's a JSON string
  let requirements = job.requirements || ''
  if (typeof requirements === 'string' && requirements.startsWith('[')) {
    try {
      requirements = JSON.parse(requirements).join(', ')
    } catch (e) {
      // If parsing fails, keep as string
    }
  }

  const calculateDaysAgo = (dateString) => {
    if (!dateString) return 'recently'
    const date = new Date(dateString)
    const now = new Date()
    const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (daysAgo === 0) return 'today'
    if (daysAgo === 1) return '1 day ago'
    if (daysAgo < 7) return `${daysAgo} days ago`
    if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`
    if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`
    return `${Math.floor(daysAgo / 365)} years ago`
  }

  return {
    id: job.id,
    user_id: job.user_id,
    title: job.title,
    company: job.company,
    employmentType: job.job_type,
    workArrangement: job.workArrangement || 'On Site',
    type: job.job_type,
    location: job.location,
    postedTime: `Posted ${calculateDaysAgo(job.created_at)}`,
    postedDate: job.created_at?.split('T')[0],
    salary: formatSalaryFromApi(job),
    // Nested structure for job_description.jsx
    description: {
      requirements: job.description || 'Job description not available',
      whatWeNeed: requirements
        ? `Required Skills & Experience:\n${requirements}`
        : 'Requirements not specified',
      aboutCompany: job.company || 'Company info not available',
      benefits: 'Competitive compensation and benefits package',
    },
    experience: job.experience || 0,
    educationLevel: job.education_level || '',
    skills: requirements,
    certification: job.certification || '',
    major: job.major || '',
    industry: job.industry || '',
    roleLevel: job.roleLevel || '',
    preferredLanguages: job.preferredLanguages || [],
    availability: job.availability || { mode: '', date: null },
  }
}