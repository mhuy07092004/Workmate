# Workmate

A job-matching platform connecting candidates with employers through intelligent two-way matching.

**Stack:** React 19 · React Router 7 · Vite 8 · TailwindCSS 4 · ESLint 9  
**Language:** JavaScript (JSX) · ES2022+
---

## Repository Structure

```
Workmate/
├── frontend/          # Frontend — React + Vite application
├── backend/           # Backend — FastAPI + SQLite API (see backend/README.md)
└── tests/             # Automated tests (frontend and backend)
```

---

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- npm 9+ (bundled with Node.js)
- Python 3.10+ (for the backend API — see `backend/README.md`)

---

## Run WebApp Locally

The frontend expects the backend API at `http://127.0.0.1:8000` (set in `frontend/.env` as `VITE_API_BASE_URL`).

```bash
# Terminal 1 — backend (required for sign-in and most pages)
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

## Run Test Locally (Ensure already download packages listed in requirements.txt)
```bash
pytest tests/ -v
```

The app runs at `http://localhost:5173`. API docs: `http://127.0.0.1:8000/docs`.

---

## Available Scripts (run from `frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all source files |

---

## Website Flow & Architecture

### Authentication Flow
1. **Auth page** (`/login`) — Two-column layout: branding panel with animated bubbles on the left; sign-in / sign-up tab switcher on the right
2. **Sign in** — Email and password only (no role picker). Calls `POST /auth/signin` against the backend (`VITE_API_BASE_URL`); role comes from the returned `user` object. Includes show/hide password and a “Remember me” checkbox (UI only)
3. **Sign up** — Candidate / Employer role switcher; the name field label switches between “Full Name” and “Company Name”. Calls `POST /auth/signup`, then auto sign-in; shows a success message and redirects to `/dashboard` after ~1.5s
4. **Session** — JWT in `workmate_token` (primary auth flag for the navbar and authenticated API calls); `workmate_current_user_email`, `workmate_user_role`, and `workmate_user_id` in `localStorage` (written in `login.jsx`, read/cleared in `userService.js`). Successful sign-in or sign-up navigates to `/dashboard`. Sign-out clears these keys via `userService.clearCurrentUser()` and returns to `/login`

### Page Structure

| Route | Page | Description | Role Access |
|-------|------|-------------|-------------|
| `/` | **Landing** | Public marketing page (hero video, about, team) | Guest |
| `/dashboard` | **Dashboard** | Role-aware home: job search + news + posts (candidates) or candidate search + news + posts (employers) | All |
| `/login` | **Login / Sign up** | Auth forms (JWT via backend) | Guest |
| `/profile` | **Profile** | Candidate or employer profile (API-backed; resume upload for candidates) | All |
| `/recommended-jobs` | **Recommended Jobs** | AI-ranked jobs from resume similarity (`GET /candidates/recommended-jobs/:id`) | Candidates |
| `/recommended-candidates` | **Recommended Candidates** | AI-ranked candidates per posted job (`GET /recommendations/candidates`) | Employers |
| `/applications` | **Applications** | Saved jobs + applied jobs (candidates) / posted jobs + applicants (employers); saved candidates list still mock for employers | All |
| `/post` | **Posts Feed** | Social posts (`GET` / `POST /posts/`) | All |
| `/post-job` | **Post Job** | Create a job listing (`POST /jobs/`) | Employers |
| `/job/:id` | **Job Description** | Job detail, save, apply entry | All |
| `/job/:id/application` | **Job Application** | Submit application (`POST /applications/`) | Candidates |
| `/news` | **News** | HR news listing (mock data; backend `GET /news/` ready) | All |
| `/news/:id` | **News Article** | Single article (mock; backend ready) | All |
| `/mynetwork` | **My Network** | Professional connections page | All |
| `/subscription` | **Subscription** | Membership tiers and billing flow | All |
| `/payment` | **Payment** | Payment step for subscription | All |
| `/help` | **Help Center** | FAQ accordion + contact information | All |
| `/settings` | **Settings** | User preferences (placeholder) | All |
| `/hr-news` | **HR News** | Placeholder (“coming soon”) | All |
| `/portal`, `/privacy`, `/terms`, `/lawyers-corners` | **Information Pages** | Static placeholders | All |
| `*` (unknown) | — | Redirects to `/` | — |

### Key Features

#### For Candidates
- **Dashboard**: Keyword + filter search via `POST /jobs/search` (location, salary range, employment type, company); news and posts from the API
- **AI recommendations**: `/recommended-jobs` ranks jobs by resume–job embedding similarity (tier limits: Free 10, Premium unlimited)
- **Applications**: Saved jobs and applied jobs with status badges via `/saved` and `/applications` APIs
- **Profile**: Education, experience, skills, resume and profile picture upload (`/profiles/*`)

#### For Employers
- **Dashboard**: Candidate search filters (keyword, location, major, degree, experience) with client-side filtering on loaded candidates; news and posts from the API
- **AI recommendations**: `/recommended-candidates` picks top matches per selected job
- **Job posting**: `/post-job` creates listings (`POST /jobs/`)
- **Applicant management**: `/applications` shows posted jobs and applicants; saved candidates UI still uses mock data
- **Company profile**: Employer profile via `/employer_profiles/*`

### Frontend Component Architecture

```
frontend/src/
├── pages/                    # Route-level pages (lazy-loaded in App.jsx)
│   ├── landing.jsx           # Public landing (/)
│   ├── login.jsx             # Sign-in / sign-up
│   ├── dashboard.jsx         # Main app home after auth
│   ├── profile.jsx           # Candidate & employer profiles
│   ├── recommended_job.jsx   # AI job recommendations
│   ├── recommended_candidate.jsx
│   ├── applications.jsx      # Saved / applied / posted jobs
│   ├── post.jsx              # Social posts feed
│   ├── post_job.jsx          # Employer job creation
│   ├── job_description.jsx   # Job detail page
│   ├── news.jsx / news_information.jsx
│   ├── subscription.jsx / payment.jsx
│   ├── mynetwork.jsx
│   ├── help.jsx
│   ├── settings.jsx / placeholder.jsx
│   └── ...
├── components/
│   ├── Navbar/               # Auth, search popover (filters UI; search not wired to API)
│   ├── Footer/
│   ├── JobCard/ / CandidateCard/ / NewsCard/ / PostCard/
│   ├── FilterSection/        # JobFilter, CandidateFilter
│   ├── JobDesription/        # Job detail + application form
│   ├── Contact/ / Button/ / Posts/ / subscription/
│   └── ProfilePictureCard/
├── services/
│   ├── userService.js        # localStorage user helpers + legacy user.json lookup
│   ├── jobStore.js           # Job normalization + legacy localStorage helpers
│   ├── applicationStore.js   # Apply + applied jobs API
│   ├── applicationStatusService.js
│   └── subscriptionService.js
├── data/
│   └── user.json             # Legacy demo data (not used for login)
├── utils/
│   └── jobFilters.js
└── App.jsx                   # Route definitions with React.lazy code-splitting
```

### Data Flow

```
┌─────────────┐     POST /auth/signin      ┌──────────────┐
│   Login     │ ─────────────────────────▶ │   Backend    │
│   Page      │ ◀──── access_token, user ──│  (FastAPI)   │
└─────────────┘                            └──────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│ localStorage: workmate_token, workmate_user_id,          │
│               workmate_current_user_email, workmate_user_role │
└──────────────────────────────────────────────────────────┘
       │
       ├──────────────────▶ Navbar (signed-in UI, logout)
       │
       └──────────────────▶ Pages (Bearer token on API calls)
                                    │
                                    ▼
                           userService.js — read/clear session;
                           profile lookups via user.json (legacy)
```

---

## Backend Integration

The frontend is **hybrid**: core flows (auth, jobs, applications, profiles, posts, recommendations, subscriptions) call the FastAPI backend. Some UI still uses mock or local-only data (news pages, navbar search/notifications, employer saved candidates on `/applications`). See `backend/README.md` for:

- API endpoints and data models
- JWT auth (`/auth/signin`, `/auth/signup` — no `/api` prefix)
- Integration map per frontend file
- Remaining wiring checklist

### Quick Backend Notes

**localStorage keys (in use):**

| Key | Purpose |
|-----|---------|
| `workmate_token` | JWT for `Authorization: Bearer` |
| `workmate_current_user_email` | Signed-in email |
| `workmate_user_role` | `candidate` or `employer` |
| `workmate_user_id` | User ID for path params (`/profiles/{id}`, etc.) |
| `workmate_saved_resume` | Client-only resume metadata |
| `workmate_posted_jobs` | Legacy — unused |

**Not used:** `workmate_signed_in` (removed in favour of JWT).

**Primary integration points:**

| File | Status |
|------|--------|
| `frontend/src/pages/login.jsx` | Wired — `POST /auth/signin`, `/auth/signup` |
| `frontend/src/pages/dashboard.jsx` | Wired — jobs/candidates search, posts, news |
| `frontend/src/pages/profile.jsx` | Wired — profiles + uploads |
| `frontend/src/pages/post_job.jsx` | Wired — `POST /jobs/` |
| `frontend/src/pages/applications.jsx` | Partial — APIs for jobs/applications; employer saved candidates mock |
| `frontend/src/pages/news.jsx`, `news_information.jsx` | Mock — backend `GET /news/` ready |
| `frontend/src/components/Navbar/Navbar.jsx` | Auth wired; search + notifications mock |

**Still to wire (high level):** news pages → `GET /news/`; navbar search → `POST /jobs/search`; employer saved candidates → `/saved` API. Full checklist in `backend/README.md`.
