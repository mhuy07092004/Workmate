/**
 * User Service - Basic user data retrieval
 * 
 * This service provides user data lookup functionality.
 * Backend integration: Replace with actual API calls when connecting to a database.
 */
import userData from '../data/user.json'

const STORAGE_KEY = 'workmate_current_user_email'

/**
 * Get the currently logged-in user's email from localStorage
 * Returns null if no user is logged in
 */
export function getCurrentUserEmail() {
  return localStorage.getItem(STORAGE_KEY)
}

/**
 * Set the currently logged-in user's email in localStorage
 * Called after successful login
 */
export function setCurrentUserEmail(email) {
  localStorage.setItem(STORAGE_KEY, email)
}

/**
 * Clear the current user from localStorage (logout)
 */
export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Find user by email
 * Mimics: GET /api/users?email={email}
 */
export function findUserByEmail(email) {
  if (!email) return null
  return userData.users.find(u => u.email === email) || null
}

/**
 * Get the currently logged-in user's full data
 * Mimics: GET /api/users/me
 */
export function getCurrentUser() {
  const email = getCurrentUserEmail()
  return findUserByEmail(email)
}

