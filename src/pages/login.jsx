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
import userData from '../data/user.json'
import { setCurrentUserEmail, setCurrentUserRole } from '../services/userService.js'

/**
 * Demo credentials loaded from user.json
 * REMOVE THIS before going to production
 */
const SIGN_IN_USERS = Object.fromEntries(
  userData.users.map(u => [u.role, { email: u.email, password: u.password }])
)

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
    setCurrentUserEmail(user.email)
    setCurrentUserRole(roleKey)
    navigate('/dashboard', { replace: true })
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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-slate-50 px-6 py-9 md:px-12 md:py-14 flex flex-col justify-between">
        {/* Animated floating bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="bubble bubble-1 absolute w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="bubble bubble-2 absolute w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="bubble bubble-3 absolute w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="bubble bubble-4 absolute w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="bubble bubble-5 absolute w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="bubble bubble-6 absolute w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="bubble bubble-7 absolute w-36 h-36 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="bubble bubble-8 absolute w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm" />
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0) translateX(0); }
              25% { transform: translateY(-30px) translateX(15px); }
              50% { transform: translateY(-20px) translateX(-15px); }
              75% { transform: translateY(-40px) translateX(10px); }
            }
            .bubble {
              animation: float 6s ease-in-out infinite;
            }
            .bubble-1 { top: 10%; left: 10%; animation-delay: 0s; animation-duration: 8s; }
            .bubble-2 { top: 20%; left: 60%; animation-delay: 1s; animation-duration: 10s; }
            .bubble-3 { top: 40%; left: 30%; animation-delay: 2s; animation-duration: 7s; }
            .bubble-4 { top: 60%; left: 80%; animation-delay: 3s; animation-duration: 9s; }
            .bubble-5 { top: 15%; left: 85%; animation-delay: 4s; animation-duration: 11s; }
            .bubble-6 { top: 70%; left: 15%; animation-delay: 5s; animation-duration: 6s; }
            .bubble-7 { top: 50%; left: 5%; animation-delay: 2.5s; animation-duration: 12s; }
            .bubble-8 { top: 80%; left: 50%; animation-delay: 1.5s; animation-duration: 8s; }
          `}</style>
        </div>

        <div className="relative z-10 inline-flex items-center gap-3 text-3xl font-bold">
          <span className="w-[42px] h-[42px] rounded-[10px] inline-flex justify-center items-center bg-white/20 text-xl">W</span>
          <span>Workmate</span>
        </div>
        <h1 className="relative z-10 mt-10 mb-0 text-[clamp(2.2rem,4vw,4.2rem)] leading-tight max-w-[380px]">Find Your Perfect Match</h1>
        <p className="relative z-10 my-[22px] max-w-[460px] text-blue-100 text-xl leading-normal">
          Connect talented professionals with their dream opportunities through intelligent
          matching.
        </p>

        <div className="relative z-10 grid gap-6">
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

          <div className="rounded-full bg-gray-200 p-1 grid grid-cols-2 gap-1.5 relative" role="tablist" aria-label="Authentication tabs">
            <div
              className="absolute top-1 bottom-1 bg-white rounded-full shadow-[0_2px_12px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out"
              style={{
                width: 'calc(50% - 6px)',
                left: activeTab === 'signin' ? '4px' : 'calc(50% + 2px)',
              }}
            />
            <button
              type="button"
              className={`relative z-10 border-0 rounded-full text-base font-bold py-2.5 bg-transparent cursor-pointer transition-colors duration-300 ${activeTab === 'signin' ? 'text-slate-900' : 'text-slate-700 hover:text-slate-900'}`}
              onClick={() => handleTabChange('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`relative z-10 border-0 rounded-full text-base font-bold py-2.5 bg-transparent cursor-pointer transition-colors duration-300 ${activeTab === 'signup' ? 'text-slate-900' : 'text-slate-700 hover:text-slate-900'}`}
              onClick={() => handleTabChange('signup')}
            >
              Sign Up
            </button>
          </div>

          <p className="mt-4 mb-2.5 text-slate-700 font-bold">I am a:</p>
          <div
            className="rounded-full bg-gray-200 p-1 grid grid-cols-2 gap-1.5 relative"
            role="radiogroup"
            aria-label="Account type"
          >
            <div
              className="absolute top-1 bottom-1 bg-white rounded-full shadow-[0_2px_12px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out pointer-events-none"
              style={{
                width: 'calc(50% - 6px)',
                left: selectedRole === 'candidate' ? '4px' : 'calc(50% + 2px)',
              }}
            />
            <button
              type="button"
              role="radio"
              aria-checked={selectedRole === 'candidate'}
              className={`relative z-10 border-0 rounded-full text-base font-bold py-2.5 bg-transparent cursor-pointer transition-colors duration-300 ${selectedRole === 'candidate' ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
              onClick={() => handleRoleChange('candidate')}
            >
              Candidate
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={selectedRole === 'employer'}
              className={`relative z-10 border-0 rounded-full text-base font-bold py-2.5 bg-transparent cursor-pointer transition-colors duration-300 ${selectedRole === 'employer' ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
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

              {/* TODO: Remember me functionality - implement persistence logic */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember-me" className="text-sm text-slate-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <button type="submit" className="mt-4 border-0 rounded-xl bg-slate-900 text-slate-50 py-3 px-3.5 text-base font-bold cursor-pointer hover:bg-slate-800 transition-colors duration-200">
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
