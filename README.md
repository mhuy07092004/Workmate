# Workmate
<<<<<<< HEAD
Smart Job Matching Application
=======

A job-matching single-page application that connects candidates with employers through intelligent, two-way matching.

Built as part of CSIT314.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI library | React | 19 |
| Router | React Router DOM | 7 |
| Build tool | Vite | 8 |
| Compiler plugin | React Compiler (via Babel) | 1.x |
| Linter | ESLint | 9 |
| Language | JavaScript (JSX) | ES2022+ |

---

## Prerequisites

- **Node.js** 18 or later — [https://nodejs.org](https://nodejs.org)
- **npm** 9 or later (bundled with Node.js)

Verify your versions:

```bash
node -v
npm -v
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (or the next available port). The terminal will print the exact URL.

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Dev server | `npm run dev` | Starts Vite dev server with HMR |
| Production build | `npm run build` | Bundles the app into `dist/` |
| Preview build | `npm run preview` | Serves the `dist/` build locally |
| Lint | `npm run lint` | Runs ESLint across all source files |

---

## Demo Credentials (Mock Auth)

The sign-in form uses hardcoded credentials while the real auth API is pending.

| Role | Email | Password |
|---|---|---|
| Candidate | `user@user.com` | `1` |
| Employer | `employer@employer.com` | `1` |

> These credentials exist only in `src/pages/home.jsx` and must be removed before production.

---

## Project Structure

```
workmate/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── main.jsx             # App entry point — mounts React into #root
│   ├── App.jsx              # Root component with route definitions
│   ├── index.css            # Global base styles
│   ├── components/
│   │   └── Navbar/
│   │       ├── Navbar.jsx   # Top navigation bar (authenticated pages)
│   │       └── Navbar.css
│   ├── pages/
│   │   ├── home.jsx         # Landing page — sign-in / sign-up
│   │   ├── home.css
│   │   ├── dashboard.jsx    # Post-login dashboard
│   │   ├── dashboard.css
│   │   └── profile.jsx      # Placeholder — not yet wired into router
│   ├── context/             # (Planned) React context providers, e.g. AuthContext
│   ├── hooks/               # (Planned) Custom React hooks
│   ├── services/            # (Planned) API service functions
│   ├── utils/               # (Planned) Helper / utility functions
│   ├── layouts/             # (Planned) Shared page layout wrappers
│   └── routes/              # (Planned) Route guard / protected route helpers
├── config/
│   ├── vite.config.js       # Vite configuration
│   └── eslint.config.js     # ESLint flat config
├── docs/
│   └── README.md            # Vite template notes (plugins, compiler, ESLint)
├── index.html               # HTML shell — Vite entry point
└── package.json
```

---

## Routing

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | Sign-in / sign-up |
| `/dashboard` | `Dashboard` | Requires sign-in (no guard yet) |
| `*` | — | Redirects to `/` |

Pages are **lazily loaded** — each page's JS chunk is only fetched when the user first visits that route.

---

## Backend Integration Notes

The following areas are stubbed and need real API calls:

- **Sign in** (`src/pages/home.jsx` → `handleSignInSubmit`): replace mock credential check with `POST /api/auth/login`
- **Sign up** (`src/pages/home.jsx` → `handleSignUpSubmit`): replace success stub with `POST /api/auth/register`
- **Dashboard cards**: fetch recommendation and application data on mount
- **Navbar user button**: read authenticated user from context; add sign-out action
- **Profile page** (`src/pages/profile.jsx`): build out and register in router

See individual `TODO` comments in each file for details.
>>>>>>> 8fbfa58 (Initial commit)
