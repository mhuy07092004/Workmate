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
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearCurrentUser, getCurrentUserRole } from '../../services/userService.js'

/** Dropdown items for candidates */
const CANDIDATE_DROPDOWN_ITEMS = [
  { label: 'Your Profile', key: 'profile', path: '/profile' },
  { label: 'Settings', key: 'settings', path: '/settings' },
  { label: 'My Applications', key: 'applications', path: '/applications' },
  { label: 'Messages', key: 'messages' },
  { label: 'My Networks', key: 'networks' },
  { label: 'Post', key: 'post', path: '/post' },
]

/** Dropdown items for employers */
const EMPLOYER_DROPDOWN_ITEMS = [
  { label: 'Your Profile', key: 'profile', path: '/profile' },
  { label: 'Settings', key: 'settings', path: '/settings' },
  { label: 'Applicants', key: 'applications', path: '/applications' },
  { label: 'Messages', key: 'messages' },
  { label: 'Post', key: 'post', path: '/post' },
]

const dropdownItemClass =
  'block w-full cursor-pointer rounded-lg border-0 bg-transparent px-3.5 py-2.5 text-left text-[0.92rem] font-medium text-slate-800 transition-colors hover:bg-slate-100'

const dropdownSignOutClass =
  'block w-full cursor-pointer rounded-lg border-0 bg-transparent px-3.5 py-2.5 text-left text-[0.92rem] font-semibold text-red-600 transition-colors hover:bg-red-50'

function Navbar() {
  const navigate = useNavigate()

  const [isSignedIn, setIsSignedIn] = useState(
    () => localStorage.getItem('workmate_signed_in') === 'true',
  )
  const [userRole, setUserRole] = useState(() => getCurrentUserRole())
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const searchPlaceholder = userRole === 'employer' ? 'Search Candidates' : 'Search Jobs'

  const dropdownItems = useMemo(() => {
    return userRole === 'employer' ? EMPLOYER_DROPDOWN_ITEMS : CANDIDATE_DROPDOWN_ITEMS
  }, [userRole])

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
    clearCurrentUser()
    setIsSignedIn(false)
    setDropdownOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-[100] flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
      {/* Brand logo */}
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="flex shrink-0 cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-slate-900 no-underline"
      >
        <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-blue-700 text-base font-bold text-white">
          W
        </span>
        <span className="text-[1.15rem] font-bold text-slate-900">Workmate</span>
      </button>

      {/* Center: search bar */}
      <div className="relative mx-auto flex max-w-[480px] flex-1 items-center">
        <span
          className="pointer-events-none absolute left-3.5 flex items-center text-slate-400"
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="w-full rounded-full border-[1.5px] border-slate-200 bg-slate-50 py-[9px] pr-4 pl-10 text-[0.95rem] text-slate-900 outline-none transition-[border-color,box-shadow,background-color] placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
          type="search"
          placeholder={searchPlaceholder}
          aria-label="Search jobs"
        />
      </div>

      {/* Right: conditional auth actions */}
      <div className="flex shrink-0 items-center gap-2">
        {isSignedIn ? (
          <>
            {/* Notification bell */}
            <button
              type="button"
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-200 hover:bg-slate-100 hover:text-blue-700"
              aria-label="Notifications"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            {/* User avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border-2 border-slate-200 bg-blue-700 p-0 text-white transition-[border-color,box-shadow] hover:border-blue-600 hover:shadow-[0_0_0_3px_rgba(37,99,235,0.18)]"
                aria-label="User profile"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <span className="text-[0.9rem] leading-none font-bold" aria-hidden="true">
                  U
                </span>
              </button>

              {dropdownOpen && (
                <ul
                  className="absolute top-[calc(100%+10px)] right-0 z-[200] m-0 min-w-[200px] list-none rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.12)]"
                  role="menu"
                >
                  {dropdownItems.map((item) => (
                    <li key={item.key} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        className={dropdownItemClass}
                        onClick={() => {
                          setDropdownOpen(false)
                          if (item.path) navigate(item.path)
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                  <li role="none" className="mx-1.5 my-1 h-px bg-gray-200" />
                  <li role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className={dropdownSignOutClass}
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
            className="cursor-pointer rounded-full border-0 bg-blue-700 px-[22px] py-[9px] text-[0.92rem] font-bold text-white transition-[background-color,box-shadow] hover:bg-blue-600 hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]"
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
