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

## Website Flow & Architecture

### Authentication Flow
1. **Landing Page** (`/login`) - Users sign in or create an account as either a **Candidate** or **Employer**
2. **Role Selection** - The UI adapts based on the selected role (candidate vs employer)
3. **Session Management** - Auth state stored in `localStorage` (to be replaced with JWT when backend is ready)

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

### Component Architecture

```
src/
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

The frontend currently uses **mock authentication** with localStorage and static JSON data. See `backend_readme.md` for:
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
1. `src/services/userService.js` - Replace mock functions with API calls
2. `src/pages/login.jsx` - Replace hardcoded credential check with API login
3. `src/pages/profile.jsx` - Connect save profile to API endpoint
4. `src/components/Navbar/Navbar.jsx` - Update auth state check

