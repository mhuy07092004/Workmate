import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import './placeholder.css'

const TITLES = {
  '/post': 'Post',
}

function Post() {
  const { pathname } = useLocation()
  const pageTitle = TITLES[pathname] ?? 'Page'

  return (
    <div className="placeholder-page">
      <Navbar />
      <main className="placeholder-main">
        <section className="placeholder-card">
          <h1 className="placeholder-title">{pageTitle}</h1>
          <p className="placeholder-copy">This section is coming soon. We&apos;re building it for you.</p>
          <Link to="/" className="placeholder-home-link">
            Back to home
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Post