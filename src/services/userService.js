/**
 * User Service - Mock backend API for user data
 * 
 * This service mimics real backend endpoints, making it easy to
 * replace with actual API calls when connecting to a database.
 * 
 * TODO (backend integration):
 *   - Replace with fetch() calls to real endpoints
 *   - Add JWT token from localStorage to request headers
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

/**
 * Update user data
 * Mimics: PUT /api/users/me
 * 
 * Note: Since we can't write to JSON files in the browser,
 * this updates localStorage. Backend dev should replace this
 * with a real API call.
 */
export function updateUser(email, newData) {
  const user = findUserByEmail(email)
  if (!user) {
    throw new Error('User not found')
  }
  
  // Merge new data with existing user
  const updatedUser = { ...user, ...newData }
  
  // Store updated user in localStorage as "saved profile"
  // Backend: Replace with PUT /api/users/me
  localStorage.setItem(`workmate_user_${email}`, JSON.stringify(updatedUser))
  
  return updatedUser
}

/**
 * Get user data, preferring saved data from localStorage
 * Falls back to the original user.json data
 */
export function getUserWithSavedData(email) {
  if (!email) return null
  
  const baseUser = findUserByEmail(email)
  if (!baseUser) return null
  
  // Check for saved profile data
  const savedData = localStorage.getItem(`workmate_user_${email}`)
  if (savedData) {
    return { ...baseUser, ...JSON.parse(savedData) }
  }
  
  return baseUser
}
