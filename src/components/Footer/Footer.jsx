import { Link } from 'react-router-dom'

const SITE_MAP_LINKS = [
  { label: 'Homepage', to: '/' },
  { label: 'HR News', to: '/news' },
  { label: 'Help Center', to: '/help' },
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
    <footer className="mt-auto bg-gray-800 border-t border-gray-700 text-gray-200">
      <div className="max-w-[1120px] mx-auto px-6 py-10 pb-12 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 md:gap-10 md:gap-x-8 items-start">
        <div className="min-w-0">
          <p className="m-0 mb-2 text-xl font-bold text-gray-50 tracking-tight">Workmate</p>
          <p className="m-0 mb-5 text-[0.95rem] leading-relaxed text-gray-400 max-w-[28ch]">Empowering Your Professional Journey.</p>
          <button type="button" className="inline-flex items-center justify-center px-[18px] py-[10px] text-sm font-semibold text-gray-50 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-gray-600 hover:border-gray-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2" onClick={scrollToTop}>
            Back to top
          </button>
        </div>

        <nav aria-label="Site map">
          <h2 className="m-0 mb-3.5 text-xs font-bold uppercase tracking-wider text-gray-400">Site Map</h2>
          <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
            {SITE_MAP_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-[0.9375rem] text-gray-300 no-underline transition-colors duration-150 hover:text-gray-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2 focus-visible:rounded-sm">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="m-0 mb-3.5 text-xs font-bold uppercase tracking-wider text-gray-400">Legal</h2>
          <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
            {LEGAL_LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link to={to} className="text-[0.9375rem] text-gray-300 no-underline transition-colors duration-150 hover:text-gray-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue-300 focus-visible:outline-offset-2 focus-visible:rounded-sm">
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
