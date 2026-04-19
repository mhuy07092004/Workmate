# Workmate

A job-matching platform connecting candidates with employers through intelligent two-way matching.

**Stack:** React 19 · React Router 7 · Vite 8 · TailwindCSS 4 · ESLint 9  
**Language:** JavaScript (JSX) · ES2022+

---

## Prerequisites

- [Node.js](https://nodejs.org) 18+ 
- npm 9+ (bundled with Node.js)

---

## Run Locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all source files |

---

## Demo Credentials (Mock Auth)

| Role | Email | Password |
|------|-------|----------|
| Candidate | `user@user.com` | `1` |
| Employer | `employer@employer.com` | `1` |

---

## Backend Integration

The frontend currently uses mock data from `src/data/user.json`. See `backend_readme.md` for:
- Required API endpoints
- Data models
- Authentication flow
- Migration guide from mock to real backend
