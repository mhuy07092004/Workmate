/**
 * dashboard.jsx — Main dashboard (root route)
 *
 * Accessible to all users. The Navbar conditionally shows a user icon
 * (signed in) or a "Join Now" button (signed out) based on localStorage.
 *
 * Planned sections (to be built out):
 *   - Recommendation: personalised job/talent suggestions from the matching engine
 *   - Applications:   candidate application tracker / employer applicant list
 *   - Help:           support articles and contact options
 *
 * TODO (backend integration):
 *   - Read the current user from AuthContext (or equivalent) to personalise the greeting
 *   - Fetch recommendation and application data from the API on mount
 */
import Footer from '../components/Footer/Footer.jsx'
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

      <Footer />
    </div>
  )
}

export default Dashboard
