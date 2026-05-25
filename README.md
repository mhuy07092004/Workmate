# Workmate

A job-matching platform connecting candidates with employers through intelligent two-way matching.

**Stack:** React 19 · React Router 7 · Vite 8 · TailwindCSS 4 · ESLint 9  
**Language:** JavaScript (JSX) · ES2022+

---

## Repository Structure

```
Workmate/
├── fe/          # Frontend — React + Vite application
└── be/          # Backend — API server (see be/README.md)
```

---

## Prerequisites

- [Node.js](https://nodejs.org) 18+
- npm 9+ (bundled with Node.js)

---

## Run Frontend Locally

```bash
cd fe
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Run Frontend with Docker

Docker guarantees an identical environment on Windows, Mac, and Linux — no local Node/npm required.

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose v2)

```bash
# Development (HMR live-reload) — run from fe/
cd fe
docker compose --profile dev up --build
# → http://localhost:5173

# Production build served by nginx — run from fe/
docker compose --profile prod up --build
# → http://localhost:8080
```

- Pass `--build` on the first run and after any `package.json` change so dependencies are reinstalled inside the image.
- The `node_modules` directory lives only inside the container; your host machine stays clean.
- To run the linter inside the container: `docker compose --profile dev run --rm frontend-dev npm run lint`

---

## Available Scripts (run from `fe/`)

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

## Website Flow & Architecture

### Authentication Flow
1. **Landing Page** (`/login`) - Two-column layout: left branding panel with animated floating bubbles; right panel with sign-in / sign-up tab switcher
2. **Sign In** - Email + password only; role is inferred from the matched user record (no role selector on sign-in). Includes show/hide password toggle and a "Remember me" checkbox (UI only — not yet functional)
3. **Sign Up** - Role selector (Candidate / Employer) appears; the name field label adapts ("Full Name" vs "Company Name")
4. **Session Management** - Auth state stored in `localStorage` via `userService.js` (`workmate_signed_in`, `workmate_current_user_email`, `workmate_user_role`); redirects to `/dashboard` on success (to be replaced with JWT when backend is ready)

### Page Structure

| Route | Page | Description | Role Access |
|-------|------|-------------|-------------|
| `/` | **Dashboard** | Main page with recommended jobs, hiring news, and social posts | All |
| `/login` | **Login/Signup** | Landing page with sign-in and sign-up forms | Guest |
| `/profile` | **Profile** | Manage personal info, education, experience, and resume | All |
| `/recommended-jobs` | **Recommended Jobs** | Job search with 15+ advanced filters | Candidates |
| `/recommended-candidates` | **Recommended Candidates** | Candidate discovery (placeholder) | Employers |
| `/applications` | **Applications** | Saved jobs + applied jobs (candidates) / Posted jobs + saved candidates (employers) | All |
| `/post` | **Posts Feed** | Social feed for professional networking | All |
| `/help` | **Help Center** | FAQ accordion + contact information | All |
| `/settings` | **Settings** | User preferences (placeholder) | All |
| `/hr-news` | **HR News** | Industry news (placeholder) | All |
| `/portal`, `/privacy`, `/terms`, `/lawyers-corners` | **Information Pages** | Static content pages (placeholders) | All |

### Key Features

#### For Candidates
- **Job Discovery**: Browse AI-recommended jobs, jobs based on viewing history, and related roles
- **Advanced Filtering**: Filter by location, salary, job category, industry, employment type, work arrangement, certifications, languages, degree requirements, experience level, and role level
- **Application Tracking**: View saved jobs and track applied positions
- **Profile Management**: Complete profile with education, work experience, and resume upload

#### For Employers
- **Candidate Discovery**: Browse recommended candidates (planned)
- **Job Posting**: Post job openings (via `/post` page)
- **Applicant Management**: View applicants and save promising candidates
- **Company Profile**: Manage company information and branding

### Frontend Component Architecture

```
fe/src/
├── pages/              # Page components (route-level)
│   ├── login.jsx       # Authentication landing page
│   ├── dashboard.jsx   # Main dashboard with recommendations
│   ├── profile.jsx     # User profile management
│   ├── recommended_job.jsx    # Job search with filters
│   ├── applications.jsx  # Saved jobs/applicants management
│   ├── post.jsx        # Social posts feed
│   ├── help.jsx        # Help center with FAQ
│   ├── settings.jsx    # Settings placeholder
│   └── placeholder.jsx # Generic placeholder for unimplemented pages
├── components/         # Reusable UI components
│   ├── Navbar/         # Top navigation with search, notifications, user dropdown
│   ├── Footer/         # Site footer with links
│   ├── JobCard/        # Job listing card
│   ├── CandidateCard/  # Candidate card for employers
│   ├── NewsCard/       # Hiring news card
│   ├── PostCard/       # Social post card
│   ├── Contact/        # Sticky sidebar contact list
│   └── Button/         # Reusable button components
├── services/           # API service layer
│   └── userService.js  # User data management (mock → real API)
├── data/               # Mock data
│   └── user.json       # Demo user accounts
└── App.jsx             # Route definitions with lazy loading
```

### Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Login     │────▶│ localStorage │────▶│   Navbar    │
│   Page      │     │   (email,    │     │  (auth      │
│             │     │   role)      │     │   state)    │
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
                                                ▼
                                       ┌─────────────┐
                                       │ userService │
                                       │   (mock)    │
                                       │             │
                                       │ • getCurrent│
                                       │   User()    │
                                       │ • findUser  │
                                       │   ByEmail() │
                                       └─────────────┘
```

---

## Backend Integration

The frontend currently uses **mock authentication** with localStorage and static JSON data. See `be/README.md` for:
- Required API endpoints specification
- Complete data models
- Authentication flow (JWT-based)
- Migration guide from mock to real backend
- Storage key recommendations

### Quick Backend Notes

**Current Mock Storage Keys:**
- `workmate_signed_in` - Boolean auth flag
- `workmate_current_user_email` - Current user identifier
- `workmate_user_role` - User role (candidate/employer)

**Target Backend Storage:**
- `workmate_token` - JWT token for authenticated requests

**Files to Modify When Adding Backend:**
1. `fe/src/services/userService.js` - Replace mock functions with API calls
2. `fe/src/pages/login.jsx` - Replace hardcoded credential check with API login
3. `fe/src/pages/profile.jsx` - Connect save profile to API endpoint
4. `fe/src/components/Navbar/Navbar.jsx` - Update auth state check
