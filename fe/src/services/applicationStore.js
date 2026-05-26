/**
 * applicationStore.js — Application and saved-resume helpers.
 *
 * Applications are persisted server-side via /applications. The saved-resume
 * metadata (file name + upload time) is still stored in localStorage because
 * the candidate's CV upload flow is local-only until the backend exposes a
 * resume-upload endpoint.
 */

import { getCurrentUserId } from './userService.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const RESUME_KEY = 'workmate_saved_resume'

function authHeaders() {
  const token = localStorage.getItem('workmate_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Submit a job application to the backend.
 * Returns the parsed JSON response on success or throws on failure.
 */
export async function submitApplication({ jobId }) {
  const userId = getCurrentUserId()
  if (!userId) throw new Error('You must be signed in to apply.')

  const response = await fetch(`${API_BASE_URL}/applications/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      user_id: parseInt(userId, 10),
      job_id: parseInt(jobId, 10),
      status: 'applied',
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Failed to apply for job')
  }
  return data
}

/** Fetch all applications submitted by the current candidate. */
export async function fetchUserApplications() {
  const userId = getCurrentUserId()
  if (!userId) return []

  const response = await fetch(`${API_BASE_URL}/applications/user/${userId}`, {
    headers: authHeaders(),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Failed to load applications')
  }
  return data.applications || []
}

/** Check whether the current candidate has applied to a given job. */
export async function hasApplied(jobId) {
  try {
    const applications = await fetchUserApplications()
    return applications.some(a => String(a.job_id) === String(jobId))
  } catch {
    return false
  }
}

// ── Saved Resume (localStorage only until backend supports uploads) ──────────

export function saveResumeMetadata(meta) {
  localStorage.setItem(RESUME_KEY, JSON.stringify(meta))
}

export function getSavedResume() {
  try {
    const raw = localStorage.getItem(RESUME_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSavedResume() {
  localStorage.removeItem(RESUME_KEY)
}
