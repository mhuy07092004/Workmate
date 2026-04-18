/**
 * dashboard.jsx — Post-login main dashboard
 *
 * Rendered after a successful sign-in (navigated to from home.jsx).
 * Currently shows a welcome message and three placeholder feature cards.
 *
 * Planned sections (to be built out):
 *   - Recommendation: personalised job/talent suggestions from the matching engine
 *   - Applications:   candidate application tracker / employer applicant list
 *   - Help:           support articles and contact options
 *
 * TODO (backend integration):
 *   - Read the current user from AuthContext (or equivalent) to personalise the greeting
 *   - Fetch recommendation and application data from the API on mount
 *   - Implement tab/query-param routing so each card section is directly linkable
 *     (the Navbar already passes ?tab=<section> query params)
 */
import Navbar from '../components/Navbar/Navbar.jsx'
import './dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard-page">
      {/* Top navigation bar — shared across all authenticated pages */}
      <Navbar />

      <main className="dashboard-content">
        {/* Welcome banner */}
        <section className="dashboard-card">
          <h1>Welcome to Workmate Dashboard</h1>
          <p>
            You are signed in successfully. Use navigation above to browse recommendations,
            applications, and support resources.
          </p>
        </section>

        {/* Feature card grid — each card will become a full feature section */}
        <section className="dashboard-grid">
          <article className="dashboard-card">
            <h2>Recommendation</h2>
            <p>Personalized job or talent suggestions will appear here.</p>
          </article>
          <article className="dashboard-card">
            <h2>Applications</h2>
            <p>Track your application statuses and activity in one place.</p>
          </article>
          <article className="dashboard-card">
            <h2>Help</h2>
            <p>Get support and guidance for profile, hiring, or account issues.</p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
