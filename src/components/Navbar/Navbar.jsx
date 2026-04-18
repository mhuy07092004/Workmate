/**
 * Navbar.jsx — Top navigation bar for authenticated pages
 *
 * Displays the Workmate brand logo, navigation links, and a user profile button.
 * Used inside Dashboard (and any future authenticated layout).
 *
 * Navigation links use query parameters (?tab=<section>) so that each dashboard
 * section can be directly linkable. The dashboard page will need to read the
 * `tab` param to render the correct content panel.
 *
 * TODO:
 *   - Wire the user profile button to open a dropdown (profile, settings, sign out)
 *   - Conditionally render links based on the user's role (candidate vs employer)
 *   - Highlight the active tab correctly when query params change (currently
 *     NavLink isActive only matches the pathname, not the query string)
 */
import { NavLink } from 'react-router-dom'
import './Navbar.css'

/**
 * Top-level navigation items.
 * Each entry has a display label and the route (with optional ?tab query param)
 * it links to. Add or remove entries here to change the nav structure.
 */
const links = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Recommendation', to: '/dashboard?tab=recommendation' },
  { label: 'Applications', to: '/dashboard?tab=applications' },
  { label: 'Help', to: '/dashboard?tab=help' },
]

function Navbar() {
  return (
    <header className="workmate-navbar">
      {/* Brand logo — clicking this could navigate home in a future iteration */}
      <div className="workmate-logo">
        <span className="workmate-logo-badge">W</span>
        <span className="workmate-logo-text">Workmate</span>
      </div>

      {/* Navigation links — NavLink automatically applies the 'active' class
          when the current URL matches the `to` prop */}
      <nav className="workmate-nav-links" aria-label="Dashboard">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User profile button — placeholder, no action yet.
          Will open a profile/settings dropdown once auth context is in place. */}
      <button type="button" className="workmate-user-btn" aria-label="User profile">
        <span className="workmate-user-avatar" aria-hidden="true">
          U
        </span>
      </button>
    </header>
  )
}

export default Navbar
