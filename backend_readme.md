# Backend Developer Guide

> **Branching Rule:** Create a new branch for all backend work. Do NOT commit directly to `main`.

---

## Overview

The frontend is **fully mock** — all data comes from `src/data/user.json` and inline arrays. Your job is to replace these with real API calls.

**Demo accounts** (in `user.json`):
| Role | Email | Password |
|------|-------|----------|
| Candidate | `user@user.com` | `1` |
| Employer | `employer@employer.com` | `1` |

**Files to touch when integrating:**
- `src/services/userService.js` — replace mock helpers with real fetch calls (start here)
- `src/pages/login.jsx` — replace `MOCK_USERS` check with `POST /api/auth/login`
- `src/pages/profile.jsx` — enable save (currently shows an alert), connect to API
- `src/components/Navbar/Navbar.jsx` — swap `workmate_signed_in` flag for token check

---

## localStorage Keys

### Current (mock)
| Key | Value |
|-----|-------|
| `workmate_signed_in` | `"true"` |
| `workmate_current_user_email` | user's email string |
| `workmate_user_role` | `"candidate"` or `"employer"` |

### Target (after backend)
| Key | Value |
|-----|-------|
| `workmate_token` | JWT string |

Remove all three mock keys once the token flow is live.

---

## Auth Flow

**Current (mock):**
`login.jsx` checks email + password against `MOCK_USERS` array → writes 3 localStorage keys → redirects to `/dashboard`

**Target:**
```
POST /api/auth/login  { email, password }
  → { user, token }
  → localStorage.setItem('workmate_token', token)
  → redirect to /dashboard
```

All subsequent requests send `Authorization: Bearer <token>`.

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/login` | No | `{ email, password }` | `{ user, token }` |
| POST | `/api/auth/register` | No | `{ email, password, role, nameOrCompany }` | `{ user, token }` |
| POST | `/api/auth/logout` | Yes | — | `{ success: true }` |

> `nameOrCompany` is the single field the sign-up form sends. Map it to `fullName` (candidate) or `companyName` (employer) on the backend.

### Users
| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| GET | `/api/users/me` | Yes | — | `User` |
| PUT | `/api/users/me` | Yes | `Partial<User>` | `User` |
| POST | `/api/users/me/resume` | Yes | `multipart/form-data` | `{ url }` |

### Jobs
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/api/jobs` | No | Query filters (see below) |
| POST | `/api/jobs` | Employer | Create listing |
| GET | `/api/jobs/:id` | No | Full job detail |
| PUT/DELETE | `/api/jobs/:id` | Owner | Edit / remove |
| GET | `/api/jobs/recommendations` | Yes | `?section=ai_chosen\|viewed\|related` |
| GET | `/api/jobs/saved` | Candidate | — |
| POST/DELETE | `/api/jobs/saved/:id` | Candidate | Save / unsave |
| GET | `/api/jobs/applied` | Candidate | — |
| POST | `/api/jobs/:id/apply` | Candidate | `{ coverLetter?, resume? }` |

**Job filter query params** (from `recommended_job.jsx`):
`location`, `salaryRange`, `jobCategory`, `industry`, `jobTitle`, `employmentType`, `companyName`, `workArrangement`, `certification`, `language`, `degree`, `dayPosted`, `experience`, `roleLevel`, `sortBy`

### Candidates (employer only)
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/candidates` | Query filters |
| GET | `/api/candidates/recommendations` | — |
| GET | `/api/candidates/saved` | — |
| POST/DELETE | `/api/candidates/saved/:id` | Save / unsave |

### Posts
| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/posts` | — |
| POST | `/api/posts` | `{ content, image? }` |
| POST | `/api/posts/:id/like` | — |

### Notifications
| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/notifications` | `?unreadOnly=false` |
| POST | `/api/notifications/:id/read` | — |
| POST | `/api/notifications/read-all` | — |

### Search
| Method | Endpoint | Params |
|--------|----------|--------|
| GET | `/api/search` | `?q=term&type=jobs\|candidates` |

---

## Data Models

```typescript
interface User {
  id: number
  email: string
  role: "candidate" | "employer"
  fullName: string
  phoneNumber: string
  educationLevel: string   // "bachelor" | "master" | "phd" | ...
  major: string
  school: string
  position: string
  companyName: string
  from: string             // "YYYY-MM"
  until: string            // "YYYY-MM" or "present"
  about: string            // max 400 words
  resumeUrl?: string
}

interface Job {
  id: number
  title: string
  company: string
  type: "Full Time" | "Part Time" | "Contract" | "Casual" | "Remote" | "Hybrid"
  location: string
  postedTime: string       // display: "Posted 3 days ago"
  salaryRange?: string     // "$100k - $150k"
  // For job detail page:
  description?: {
    requirements: string
    whatWeNeed: string
    aboutCompany: string
    benefits?: string
  }
}

interface Application {
  id: number
  jobId: number
  candidateId: number
  status: "pending" | "reviewed" | "accepted" | "rejected"
  appliedAt: string
}

interface Post {
  id: number
  authorId: number
  authorName: string
  content: string
  image?: string
  likes: number
  comments: number
  createdAt: string
}
```

---

## Migration Checklist

**Phase 1 — Auth (do first)**
- [ ] `POST /api/auth/login` + `POST /api/auth/register` + `POST /api/auth/logout`
- [ ] `GET /api/users/me`
- [ ] Update `src/services/userService.js` — add `getToken()`, `setToken()`, `clearToken()`
- [ ] Update `src/pages/login.jsx` — swap mock check for API call, store JWT, wire up "Remember me"
- [ ] Update `src/components/Navbar/Navbar.jsx` — use token presence instead of `workmate_signed_in`

**Phase 2 — Profile**
- [ ] `PUT /api/users/me` + `POST /api/users/me/resume`
- [ ] Enable save in `src/pages/profile.jsx` (remove the alert stub)

**Phase 3 — Jobs**
- [ ] `GET /api/jobs` (with filters), `POST /api/jobs`, `GET /api/jobs/:id`, `POST /api/jobs/:id/apply`
- [ ] Replace inline mock arrays in `dashboard.jsx`, `recommended_job.jsx`, `job_description.jsx`

**Phase 4 — Applications**
- [ ] Saved/applied/posted job endpoints + candidate saved endpoints
- [ ] Replace mock arrays in `applications.jsx`

**Phase 5 — Social & Notifications (low priority)**
- [ ] Posts CRUD + notifications endpoints
- [ ] Replace `SAMPLE_POSTS` in `post.jsx` and `MOCK_NOTIFICATIONS` in `Navbar.jsx`

---

## Common Issues

**CORS** — Add to Flask: `CORS(app, origins=['http://localhost:5173'])`

**Role-based UI broken** — Backend login response must include `role: "candidate" | "employer"` in the user object.

**Where to find integration points** — Search the codebase for `BACKEND DEV NOTE` or `TODO (backend integration)`.
