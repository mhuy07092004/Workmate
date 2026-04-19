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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ── Left panel: branding and feature highlights ── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-slate-50 px-6 py-9 md:px-12 md:py-14 flex flex-col justify-between">
        <div className="inline-flex items-center gap-3 text-3xl font-bold">
          <span className="w-[42px] h-[42px] rounded-[10px] inline-flex justify-center items-center bg-white/20 text-xl">W</span>
          <span>Workmate</span>
        </div>
        <h1 className="mt-10 mb-0 text-[clamp(2.2rem,4vw,4.2rem)] leading-tight max-w-[380px]">Find Your Perfect Match</h1>
        <p className="my-[22px] max-w-[460px] text-blue-100 text-xl leading-normal">
          Connect talented professionals with their dream opportunities through intelligent
          matching.
        </p>

        <div className="grid gap-6">
          <article>
            <h3 className="mb-1.5 text-[1.3rem]">Two-Way Matching</h3>
            <p className="text-blue-100">Candidates find jobs, employers find talent.</p>
          </article>
          <article>
            <h3 className="mb-1.5 text-[1.3rem]">Smart Recommendations</h3>
            <p className="text-blue-100">AI-powered matching based on skills and requirements.</p>
          </article>
        </div>
      </section>

      <section className="bg-gray-100 grid place-items-center p-6">
        <div className="w-full max-w-[520px] bg-white rounded-2xl p-8 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <h2 className="m-0 text-center text-3xl">Welcome Back</h2>
          <p className="my-3 text-center text-slate-500">Sign in to your account or create a new one</p>

          <div className="rounded-full bg-gray-200 p-1 grid grid-cols-2 gap-1.5" role="tablist" aria-label="Authentication tabs">
            <button
              type="button"
              className={`border-0 rounded-full text-base font-bold py-2.5 bg-transparent text-slate-700 cursor-pointer ${activeTab === 'signin' ? 'bg-white text-slate-900 shadow-[0_2px_12px_rgba(15,23,42,0.08)]' : ''}`}
              onClick={() => handleTabChange('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`border-0 rounded-full text-base font-bold py-2.5 bg-transparent text-slate-700 cursor-pointer ${activeTab === 'signup' ? 'bg-white text-slate-900 shadow-[0_2px_12px_rgba(15,23,42,0.08)]' : ''}`}
              onClick={() => handleTabChange('signup')}
            >
              Sign Up
            </button>
          </div>

          <p className="mt-4 mb-2.5 text-slate-700 font-bold">I am a:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`border-[1.5px] border-slate-300 rounded-xl bg-white text-slate-900 text-base font-bold py-4 px-3 cursor-pointer ${selectedRole === 'candidate' ? 'border-blue-600 bg-blue-50 text-blue-700' : ''}`}
              onClick={() => handleRoleChange('candidate')}
            >
              Candidate
            </button>
            <button
              type="button"
              className={`border-[1.5px] border-slate-300 rounded-xl bg-white text-slate-900 text-base font-bold py-4 px-3 cursor-pointer ${selectedRole === 'employer' ? 'border-blue-600 bg-blue-50 text-blue-700' : ''}`}
              onClick={() => handleRoleChange('employer')}
            >
              Employer
            </button>
          </div>

          {/* Conditionally render sign-in or sign-up form based on active tab */}
          {activeTab === 'signin' ? (
            <form className="mt-5 grid gap-2" onSubmit={handleSignInSubmit}>
              <label htmlFor="signin-email" className="mt-1 text-slate-700 font-bold">Email Address</label>
              <input
                id="signin-email"
                type="email"
                placeholder="your.email@example.com"
                value={signInForm.email}
                onChange={(event) =>
                  setSignInForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3 px-3.5 text-slate-900 focus:outline-[2px] focus:outline-blue-200 focus:border-blue-600"
              />

              <label htmlFor="signin-password" className="mt-1 text-slate-700 font-bold">Password</label>
              <input
                id="signin-password"
                type="password"
                placeholder="Enter your password"
                value={signInForm.password}
                onChange={(event) =>
                  setSignInForm((prev) => ({ ...prev, password: event.target.value }))
                }
                className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3 px-3.5 text-slate-900 focus:outline-[2px] focus:outline-blue-200 focus:border-blue-600"
              />

              <button type="submit" className="mt-4 border-0 rounded-xl bg-slate-900 text-slate-50 py-3 px-3.5 text-base font-bold cursor-pointer hover:bg-slate-800">
                Sign In
              </button>
            </form>
          ) : (
            <form className="mt-5 grid gap-2" onSubmit={handleSignUpSubmit}>
              <label htmlFor="signup-name" className="mt-1 text-slate-700 font-bold">{signUpLabel}</label>
              <input
                id="signup-name"
                type="text"
                placeholder={selectedRole === 'candidate' ? 'Your full name' : 'Your company name'}
                value={signUpForm.nameOrCompany}
                onChange={(event) =>
                  setSignUpForm((prev) => ({ ...prev, nameOrCompany: event.target.value }))
                }
                className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3 px-3.5 text-slate-900 focus:outline-[2px] focus:outline-blue-200 focus:border-blue-600"
              />

              <label htmlFor="signup-email" className="mt-1 text-slate-700 font-bold">Email Address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="your.email@example.com"
                value={signUpForm.email}
                onChange={(event) =>
                  setSignUpForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3 px-3.5 text-slate-900 focus:outline-[2px] focus:outline-blue-200 focus:border-blue-600"
              />

              <label htmlFor="signup-password" className="mt-1 text-slate-700 font-bold">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={signUpForm.password}
                onChange={(event) =>
                  setSignUpForm((prev) => ({ ...prev, password: event.target.value }))
                }
                className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3 px-3.5 text-slate-900 focus:outline-[2px] focus:outline-blue-200 focus:border-blue-600"
              />

              <button type="submit" className="mt-4 border-0 rounded-xl bg-slate-900 text-slate-50 py-3 px-3.5 text-base font-bold cursor-pointer hover:bg-slate-800">
                Sign Up
              </button>
            </form>
          )}

          {/* Feedback banners — only one is visible at a time */}
          {error ? <p className="mt-3.5 text-[0.95rem] font-semibold text-red-600">{error}</p> : null}
          {success ? <p className="mt-3.5 text-[0.95rem] font-semibold text-green-700">{success}</p> : null}

          <p className="mt-4 text-[0.88rem] text-slate-500">
            By continuing, you agree to Workmate&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login
