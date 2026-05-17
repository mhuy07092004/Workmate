/**
 * jobStore.js — Shared job constants and localStorage persistence
 *
 * Single source of truth for:
 *   - EMPLOYMENT_TYPES / WORK_ARRANGEMENTS  (used by post_job form AND JobFilter)
 *   - EDUCATION_LEVELS                      (form dropdown)
 *   - appendPostedJob / getPostedJobs       (localStorage, key workmate_posted_jobs)
 *   - normalizePostedJob                    (maps raw form data → canonical job object)
 *
 * The canonical job object shape expected by JobCard and JobFilter:
 * {
 *   id            : number | string,
 *   title         : string,
 *   company       : string,          // short display name
 *   employmentType: string,          // one of EMPLOYMENT_TYPES
 *   workArrangement: string,         // one of WORK_ARRANGEMENTS
 *   location      : string,
 *   postedTime    : string,          // human-readable, e.g. "Posted just now"
 *   // optional — present when available
 *   salary        : string,          // e.g. "$100k - $150k"
 *   experience    : number,          // years (raw number from form)
 *   educationLevel: string,          // from EDUCATION_LEVELS
 *   description   : string,
 *   skills        : string,
 * }
 */

export const EMPLOYMENT_TYPES = ['Casual', 'Part Time', 'Contract', 'Full Time']

export const WORK_ARRANGEMENTS = ['Remote', 'On Site', 'Hybrid']

export const EDUCATION_LEVELS = [
  'High School',
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'No specific education required',
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
