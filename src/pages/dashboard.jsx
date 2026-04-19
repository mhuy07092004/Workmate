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
import FeatureCardGrid from '../components/Button/Profile_Button.jsx'

const FEATURE_CARDS = [
  {
    title: 'Recommendation',
    description: 'Personalized job or talent suggestions will appear here.',
  },
  {
    title: 'Applications',
    description: 'Track your application statuses and activity in one place.',
  },
  {
    title: 'Help',
    description: 'Get support and guidance for profile, hiring, or account issues.',
  },
]

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top navigation bar — shared across all authenticated pages */}
      <Navbar />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Welcome banner */}
        <section className="bg-white rounded-[14px] px-8 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
          <h1 className="mb-2.5 text-[1.6rem] text-slate-900">Welcome to Workmate Dashboard</h1>
          <p className="text-slate-600 leading-relaxed">
            You are signed in successfully. Use navigation above to browse recommendations,
            applications, and support resources.
          </p>
        </section>

        {/* Feature card grid — each card will become a full feature section */}
        <FeatureCardGrid cards={FEATURE_CARDS} />
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
