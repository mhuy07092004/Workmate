import { Link } from 'react-router-dom'
import './Footer.css'

const SITE_MAP_LINKS = [
  { label: 'Homepage', to: '/' },
  { label: 'HR News', to: '/hr-news' },
  { label: 'Contact us', to: '/contact' },
  { label: 'Portal', to: '/portal' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms Of Service', to: '/terms' },
  { label: "Lawyer's Corners", to: '/lawyers-corners' },
]

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="workmate-footer">
      <div className="workmate-footer-inner">
        <div className="workmate-footer-brand">
          <p className="workmate-footer-title">Workmate</p>
          <p className="workmate-footer-slogan">Empowering Your Professional Journey.</p>
          <button type="button" className="workmate-footer-back-top" onClick={scrollToTop}>
            Back to top
          </button>
        </div>

        <nav className="workmate-footer-nav" aria-label="Site map">
          <h2 className="workmate-footer-heading">Site Map</h2>
          <ul className="workmate-footer-list">
            {SITE_MAP_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="workmate-footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="workmate-footer-nav" aria-label="Legal">
          <h2 className="workmate-footer-heading">Legal</h2>
          <ul className="workmate-footer-list">
            {LEGAL_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="workmate-footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
