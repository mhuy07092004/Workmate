/**
 * login.jsx — Landing page (sign-in / sign-up)
 *
 * TODO (backend integration):
 *   - Replace SIGN_IN_USERS with a real POST /api/auth/login call
 *   - Replace the sign-up success stub with a POST /api/auth/register call
 *   - Store the returned JWT / session token (e.g. in Context or localStorage)
 */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

/**
 * Hardcoded demo credentials
 * Keys match the role identifiers used throughout the component ('candidate' | 'employer').
 * REMOVE THIS before going to production
 */
const SIGN_IN_USERS = {
  candidate: {
    email: 'user@user.com',
    password: '1',
  },
  employer: {
    email: 'employer@employer.com',
    password: '1',
  },
}

/** Human-readable labels for each role, used in success/error messages. */
const ROLE_LABELS = {
  candidate: 'Candidate',
  employer: 'Employer',
}

/**
 * Normalises a raw role string to either 'employer' or 'candidate'.
 * Treats any string starting with "emp" (case-insensitive) as 'employer'.
 */
function normalizeRole(role) {
  return role.trim().toLowerCase().startsWith('emp') ? 'employer' : 'candidate'
}

function Login() {
  const navigate = useNavigate()

  /** Controls which form tab is shown: 'signin' | 'signup' */
  const [activeTab, setActiveTab] = useState('signin')

  /** Currently selected user role: 'candidate' | 'employer' */
  const [selectedRole, setSelectedRole] = useState('candidate')

  /** Validation / API error message shown below the form */
  const [error, setError] = useState('')

  /** Success message shown after a successful sign-up capture */
  const [success, setSuccess] = useState('')

  /** Controlled fields for the sign-in form */
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  })

  /** Controlled fields for the sign-up form */
  const [signUpForm, setSignUpForm] = useState({
    nameOrCompany: '',
    email: '',
    password: '',
  })

  /**
   * Dynamic label for the name/company field in the sign-up form.
   * Recomputed only when selectedRole changes.
   */
  const signUpLabel = useMemo(
    () => (selectedRole === 'candidate' ? 'Full Name' : 'Company Name'),
    [selectedRole],
  )

  /** Clears both error and success banners — called before any new action. */
  const resetMessages = () => {
    setError('')
    setSuccess('')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    resetMessages()
  }

  const handleRoleChange = (role) => {
    setSelectedRole(role)
    resetMessages()
  }

  /**
   * Sign-in submit handler.
   *
   * On success, sets the auth flag in localStorage and redirects to /.
   *
   * Backend integration: replace the credential check with an API call and
   * handle the returned token here.
   */
  const handleSignInSubmit = (event) => {
    event.preventDefault()
    resetMessages()

    if (!signInForm.email || !signInForm.password || !selectedRole) {
      setError('Email, password, and role are required for sign in.')
      return
    }

    const roleKey = normalizeRole(selectedRole)
    const user = SIGN_IN_USERS[roleKey]

    const isValidUser =
      signInForm.email.trim().toLowerCase() === user.email &&
      signInForm.password === user.password

    if (!isValidUser) {
      setError('Invalid sign in credentials for the selected role.')
      return
    }

    localStorage.setItem('workmate_signed_in', 'true')
    navigate('/', { replace: true })
  }

  /**
   * Sign-up submit handler.
   *
   * Validates that all fields are filled, then shows a success message and
   * resets the form. Currently no data is persisted.
   *
   * Backend integration: replace the success stub with a POST /api/auth/register
   * call. On success, either navigate to / or show a verification prompt.
   */
  const handleSignUpSubmit = (event) => {
    event.preventDefault()
    resetMessages()

    if (!signUpForm.nameOrCompany || !signUpForm.email || !signUpForm.password) {
      setError('Please complete all required sign up fields.')
      return
    }

    setSuccess(`${ROLE_LABELS[selectedRole]} account details captured successfully.`)
    setSignUpForm({
      nameOrCompany: '',
      email: '',
      password: '',
    })
  }

  return (
    <main className="login-page">
      {/* ── Left panel: branding and feature highlights ── */}
      <section className="login-hero">
        <div className="hero-brand">
          <span className="hero-brand-icon">W</span>
          <span>Workmate</span>
        </div>
        <h1>Find Your Perfect Match</h1>
        <p>
          Connect talented professionals with their dream opportunities through intelligent
          matching.
        </p>

        <div className="hero-feature-list">
          <article>
            <h3>Two-Way Matching</h3>
            <p>Candidates find jobs, employers find talent.</p>
          </article>
          <article>
            <h3>Smart Recommendations</h3>
            <p>AI-powered matching based on skills and requirements.</p>
          </article>
        </div>
      </section>

      {/* ── Right panel: authentication card ── */}
      <section className="login-auth-panel">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Sign in to your account or create a new one</p>

          {/* Tab switcher: toggles between Sign In and Sign Up forms */}
          <div className="auth-tab-switcher" role="tablist" aria-label="Authentication tabs">
            <button
              type="button"
              className={activeTab === 'signin' ? 'active' : ''}
              onClick={() => handleTabChange('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={activeTab === 'signup' ? 'active' : ''}
              onClick={() => handleTabChange('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Role switcher: determines which mock user to authenticate against */}
          <p className="role-helper">I am a:</p>
          <div className="role-switcher">
            <button
              type="button"
              className={selectedRole === 'candidate' ? 'active' : ''}
              onClick={() => handleRoleChange('candidate')}
            >
              Candidate
            </button>
            <button
              type="button"
              className={selectedRole === 'employer' ? 'active' : ''}
              onClick={() => handleRoleChange('employer')}
            >
              Employer
            </button>
          </div>

          {/* Conditionally render sign-in or sign-up form based on active tab */}
          {activeTab === 'signin' ? (
            <form className="auth-form" onSubmit={handleSignInSubmit}>
              <label htmlFor="signin-email">Email Address</label>
              <input
                id="signin-email"
                type="email"
                placeholder="your.email@example.com"
                value={signInForm.email}
                onChange={(event) =>
                  setSignInForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />

              <label htmlFor="signin-password">Password</label>
              <input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={signInForm.password}
                onChange={(event) =>
                  setSignInForm((prev) => ({ ...prev, password: event.target.value }))
                }
              />

              <button type="submit" className="primary-btn">
                Sign In
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignUpSubmit}>
              {/* Label switches between "Full Name" and "Company Name" based on role */}
              <label htmlFor="signup-name">{signUpLabel}</label>
              <input
                id="signup-name"
                type="text"
                placeholder={selectedRole === 'candidate' ? 'Your full name' : 'Your company name'}
                value={signUpForm.nameOrCompany}
                onChange={(event) =>
                  setSignUpForm((prev) => ({ ...prev, nameOrCompany: event.target.value }))
                }
              />

              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="your.email@example.com"
                value={signUpForm.email}
                onChange={(event) =>
                  setSignUpForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />

              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={signUpForm.password}
                onChange={(event) =>
                  setSignUpForm((prev) => ({ ...prev, password: event.target.value }))
                }
              />

              <button type="submit" className="primary-btn">
                Sign Up
              </button>
            </form>
          )}

          {/* Feedback banners — only one is visible at a time */}
          {error ? <p className="auth-feedback auth-error">{error}</p> : null}
          {success ? <p className="auth-feedback auth-success">{success}</p> : null}

          <p className="auth-policy">
            By continuing, you agree to Workmate&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
