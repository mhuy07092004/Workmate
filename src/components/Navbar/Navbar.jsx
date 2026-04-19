/**
 * Navbar.jsx — Top navigation bar
 *
 * Three zones:
 *   Left  — Workmate brand logo
 *   Center — "Search Job" search bar
 *   Right  — Notification bell + user dropdown (signed in) OR "Join Now" button (signed out)
 *
 * Auth state is read from localStorage ('workmate_signed_in').
 * Sign-out clears localStorage and redirects to /login.
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

const DROPDOWN_ITEMS = [
  { label: 'Your Profile', key: 'profile' },
  { label: 'Settings', key: 'settings' },
  { label: 'My Applications', key: 'applications' },
  { label: 'Messages', key: 'messages' },
  { label: 'My Networks', key: 'networks' },
  { label: 'Post', key: 'post' },
]

function Navbar() {
  const navigate = useNavigate()

  const [isSignedIn, setIsSignedIn] = useState(
    () => localStorage.getItem('workmate_signed_in') === 'true',
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  /** Close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('workmate_signed_in')
    setIsSignedIn(false)
    setDropdownOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="workmate-navbar">
      {/* Brand logo */}
      <div className="workmate-logo">
        <span className="workmate-logo-badge">W</span>
        <span className="workmate-logo-text">Workmate</span>
      </div>

      {/* Center: search bar */}
      <div className="workmate-search-wrapper">
        <span className="workmate-search-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="workmate-search-bar"
          type="search"
          placeholder="Search Job"
          aria-label="Search jobs"
        />
      </div>

      {/* Right: conditional auth actions */}
      <div className="workmate-nav-actions">
        {isSignedIn ? (
          <>
            {/* Notification bell */}
            <button
              type="button"
              className="workmate-notification-btn"
              aria-label="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            {/* User avatar + dropdown */}
            <div className="workmate-user-menu" ref={dropdownRef}>
              <button
                type="button"
                className="workmate-user-btn"
                aria-label="User profile"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <span className="workmate-user-avatar" aria-hidden="true">U</span>
              </button>

              {dropdownOpen && (
                <ul className="workmate-dropdown" role="menu">
                  {DROPDOWN_ITEMS.map((item) => (
                    <li key={item.key} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        className="workmate-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                  <li role="none" className="workmate-dropdown-divider" />
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className="workmate-dropdown-item workmate-dropdown-signout"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            className="workmate-join-btn"
            onClick={() => navigate('/login')}
          >
            Join Now
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
