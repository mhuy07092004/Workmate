/**
 * main.jsx — Application entry point
 *
 * Mounts the React app into the #root DOM element defined in index.html.
 * StrictMode enables additional runtime warnings during development.
 * BrowserRouter provides HTML5 history-based client-side routing for the
 * entire app; all <Route> definitions in App.jsx operate within this context.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
