/**
 * App.jsx — Root component and client-side route definitions
 *
 * Pages are loaded lazily (React.lazy + dynamic import) so each page's JS
 * bundle is only fetched when the user first navigates to that route — this
 * keeps the initial bundle small (code-splitting).
 *
 * Suspense wraps all routes and renders a simple loading indicator while a
 * lazy chunk is being downloaded.
 *
 * Route map:
 *   /            → Home page (sign-in / sign-up)
 *   /dashboard   → Dashboard page (post-login)
 *   *            → Redirect to / for any unknown path
 *
 * To add a new page:
 *   1. Create the component under src/pages/
 *   2. Add a lazy() import here
 *   3. Add a <Route> inside <Routes>
 */
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const Home = lazy(() => import('./pages/home.jsx'))
const Dashboard = lazy(() => import('./pages/dashboard.jsx'))

function App() {
  return (
    <Suspense fallback={<div className="page-loader">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catch-all: redirect unknown paths back to the home/login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
