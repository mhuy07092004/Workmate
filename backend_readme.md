# Backend Developer Guide
# anh dùng Claude tóm tắt cho source này nên chỗ nào không hiểu cứ nhắn hỏi cấu trúc hay file này làm gì,...
# Khi apply Backend Flask các thứ thì tạo branch mới để commit code vào branch đó, không commit trực tiếp vào main.

Guide for backend developers integrating with the Workmate frontend.

---

## Current Architecture

The frontend uses a **mock service layer** (`src/services/userService.js`) that mimics REST API calls using localStorage and static JSON. Your task is to replace these with real HTTP requests.

---

## Data Models

### User

```typescript
{
  email: string,           // Primary key / login identifier
  password: string,        // Hashed in production
  role: "candidate" | "employer",
  
  // Profile fields
  fullName: string,
  emailAddress: string,
  phoneNumber: string,
  educationLevel: string,
  major: string,
  school: string,
  position: string,
  companyName: string,     // For employers
  from: string,            // Start date (YYYY-MM)
  until: string,           // End date or "present"
  about: string            // Bio / description
}
```

---

## Required API Endpoints

### Authentication

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/auth/login` | POST | Authenticate user | `{ email, password }` | `{ user, token }` |
| `/api/auth/register` | POST | Create new account | `{ email, password, role, fullName }` | `{ user, token }` |
| `/api/auth/logout` | POST | Invalidate token | — | `{ success: true }` |

### Users

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/users/me` | GET | Get current user | — | `User` |
| `/api/users/me` | PUT | Update profile | `Partial<User>` | `User` |
| `/api/users?email={email}` | GET | Find by email | Query param | `User` |

### Coming Soon (Planned Features)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jobs` | GET | List job postings |
| `/api/jobs` | POST | Create job (employer) |
| `/api/match/recommendations` | GET | Get job/talent recommendations |
| `/api/applications` | GET | List user's applications |
| `/api/applications` | POST | Submit application |

---

## Authentication Flow

### Current (Mock)
1. User submits credentials
2. Frontend validates against `src/data/user.json`
3. Email stored in `localStorage.setItem('workmate_current_user_email', email)`
4. Auth state: `localStorage.setItem('workmate_signed_in', 'true')`

### Target (Real Backend)
1. User submits credentials → `POST /api/auth/login`
2. Backend returns `JWT token`
3. Frontend stores token in `localStorage.setItem('workmate_token', token)`
4. Include token in subsequent request headers: `Authorization: Bearer <token>`
5. Sign out: remove token from localStorage

---

## Migration Checklist

### Files to Modify

| File | Current Behavior | Change To |
|------|-----------------|-----------|
| `src/services/userService.js` | Reads from `user.json` + localStorage | `fetch()` to real endpoints |
| `src/pages/login.jsx` | Validates against `SIGN_IN_USERS` object | `POST /api/auth/login` |
| `src/pages/login.jsx` | Sign-up is a stub | `POST /api/auth/register` |
| `src/pages/profile.jsx` | Saves to localStorage | `PUT /api/users/me` |
| `src/components/Navbar/Navbar.jsx` | Reads `workmate_signed_in` flag | Check token validity |

### Key Code Patterns

Replace this pattern in `userService.js`:
```javascript
// BEFORE (mock)
export function getCurrentUser() {
  const email = getCurrentUserEmail()
  return findUserByEmail(email)
}

// AFTER (real API)
export async function getCurrentUser() {
  const res = await fetch('/api/users/me', {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  })
  if (!res.ok) throw new Error('Failed to fetch user')
  return res.json()
}
```

---

## Storage Keys

Frontend currently uses these localStorage keys:

| Key | Purpose |
|-----|---------|
| `workmate_current_user_email` | Current user identifier |
| `workmate_signed_in` | Boolean auth state flag |
| `workmate_user_${email}` | Cached profile data |

**Recommendation:** Replace with a single `workmate_token` key holding the JWT.

---

## Frontend Project Structure

```
src/
├── pages/           # Page components (login, dashboard, profile, etc.)
├── components/      # Reusable UI (Navbar, Footer, Button)
├── services/        # API service layer (your integration point)
├── data/            # Mock data (user.json) — remove when backend ready
├── context/         # React context (planned for auth state)
├── hooks/           # Custom hooks (planned)
└── utils/           # Helper functions (planned)
```

---

## Testing Integration

1. Start your backend server on expected port
2. Update `userService.js` endpoints if needed (port, path prefix)
3. Test auth flow: login → view dashboard → update profile → logout
4. Demo accounts for testing:
   - Candidate: `user@user.com` / `1`
   - Employer: `employer@employer.com` / `1`

---

## Questions?

Check `src/services/userService.js` comments marked `TODO (backend integration)` for specific migration notes.
