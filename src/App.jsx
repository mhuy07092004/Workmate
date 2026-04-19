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
 *   /            → Dashboard page (main page)
 *   /login       → Login page (sign-in / sign-up)
 *   /hr-news, /contact, /portal, /privacy, /terms, /lawyers-corners
 *                → Placeholder (“coming soon”) until real pages exist
 *   *            → Redirect to / for any unknown path
 *
 * To add a new page:
 *   1. Create the component under src/pages/
 *   2. Add a lazy() import here
 *   3. Add a <Route> inside <Routes>
 */
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const Login = lazy(() => import('./pages/login.jsx'))
const Dashboard = lazy(() => import('./pages/dashboard.jsx'))
const PlaceholderPage = lazy(() => import('./pages/placeholder.jsx'))
const Profile = lazy(() => import('./pages/profile.jsx'))
const Settings = lazy(() => import('./pages/settings.jsx'))
const Post = lazy(() => import('./pages/post.jsx'))

function App() {
  return (
    <Suspense fallback={<div className="page-loader">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hr-news" element={<PlaceholderPage />} />
        <Route path="/contact" element={<PlaceholderPage />} />
        <Route path="/portal" element={<PlaceholderPage />} />
        <Route path="/privacy" element={<PlaceholderPage />} />
        <Route path="/terms" element={<PlaceholderPage />} />
        <Route path="/lawyers-corners" element={<PlaceholderPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/post" element={<Post />} />
        {/* Catch-all: redirect unknown paths back to the dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
