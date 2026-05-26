import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import './placeholder.css'

const TITLES = {
  '/hr-news': 'HR News',
  '/contact': 'Contact us',
  '/portal': 'Portal',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/lawyers-corners': "Lawyer's Corners",
  '/recommended-candidates': 'Recommended Candidates',
  '/recommended-jobs': 'Recommended Jobs',
}

function PlaceholderPage() {
  const { pathname } = useLocation()
  const pageTitle = TITLES[pathname] ?? 'Page'

  return (
    <div className="placeholder-page">
      <Navbar />
      <main className="placeholder-main">
        <section className="placeholder-card">
          <h1 className="placeholder-title">{pageTitle}</h1>
          <p className="placeholder-copy">This section is coming soon. We&apos;re building it for you.</p>
          <Link to="/dashboard" className="placeholder-home-link">
            Back to home
          </Link>
        </section>
      </main>
    </div>
  )
}

export default PlaceholderPage
