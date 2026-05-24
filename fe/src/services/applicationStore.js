/**
 * applicationStore.js — Mock persistence for job applications and saved resume
 *
 * Mirrors the pattern used by jobStore.js (localStorage-backed, no real API).
 *
 * Keys:
 *   workmate_applications   — array of submitted application objects
 *   workmate_saved_resume   — metadata for the candidate's saved CV (fileName, uploadedAt)
 *
 * Backend integration: replace every function body with the equivalent API call.
 */

const APPLICATIONS_KEY = 'workmate_applications'
const RESUME_KEY = 'workmate_saved_resume'

// ── Applications ─────────────────────────────────────────────────────────────

/**
 * Append a new application to localStorage.
 * @param {{ jobId: string|number, jobTitle: string, company: string, coverLetter: string, resumeSource: 'saved'|'uploaded', resumeFileName: string|null, appliedAt: string }} application
 */
export function appendApplication(application) {
  const existing = getApplications()
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([...existing, application]))
}

/** Read all submitted applications from localStorage. */
export function getApplications() {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Check if the current user has already applied to a given job id. */
export function hasApplied(jobId) {
  return getApplications().some(a => String(a.jobId) === String(jobId))
}

// ── Saved Resume ─────────────────────────────────────────────────────────────

/**
 * Persist resume metadata (no actual file binary — frontend only).
 * @param {{ fileName: string, uploadedAt: string }} meta
 */
export function saveResumeMetadata(meta) {
  localStorage.setItem(RESUME_KEY, JSON.stringify(meta))
}

/**
 * Read saved resume metadata.
 * Returns null when no resume has been saved.
 * @returns {{ fileName: string, uploadedAt: string } | null}
 */
export function getSavedResume() {
  try {
    const raw = localStorage.getItem(RESUME_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Remove saved resume metadata. */
export function clearSavedResume() {
  localStorage.removeItem(RESUME_KEY)
}
