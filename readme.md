# Workmate

A job-matching platform connecting candidates with employers through intelligent two-way matching.

**Frontend:** React 19 · React Router 7 · Vite 8 · TailwindCSS 4 · ESLint 9  
**Backend:** FastAPI · SQLAlchemy · SQLite · JWT · sentence-transformers  
**Language:** JavaScript (JSX) · Python 3

---

## Repository Structure

```
Workmate/
├── frontend/    # React + Vite application
├── backend/     # FastAPI API server (see backend/README.md)
└── docker-compose.yml
```

For full architecture, integration status, and conventions see [`CLAUDE.md`](CLAUDE.md).

---

## Prerequisites

- [Node.js](https://nodejs.org) 18+ and npm 9+
- [Python](https://python.org) 3.10+ with pip
- (Optional) [Docker Desktop](https://www.docker.com/products/docker-desktop/) for containerized frontend

---

## Run Locally

### 1. Start the backend (port 8000)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API docs: `http://127.0.0.1:8000/docs`

### 2. Start the frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Ensure `frontend/.env` contains:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Open `http://localhost:5173`.

### 3. Create an account

The backend does **not** seed demo users. Register via the sign-up tab on `/login`, or use the Swagger UI at `/docs` to create users.

---

## Run with Docker (frontend only)

The backend is not yet in Docker Compose — run it locally via uvicorn alongside the containerized frontend.

```bash
# Development (Vite HMR) — from repo root
docker compose --profile dev up --build
# → http://localhost:5173

# Production (nginx) — from repo root
docker compose --profile prod up --build
# → http://localhost:8080
```

- Pass `--build` on first run and whenever `frontend/package.json` changes.
- Lint inside container: `docker compose --profile dev run --rm frontend-dev npm run lint`

---

## Available Scripts

### Frontend (run from `frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all source files |

### Backend (run from `backend/`)

| Command | Description |
|---------|-------------|
| `uvicorn main:app --reload` | Start API server with auto-reload |
| Open `/docs` | Interactive Swagger UI |

---

## Authentication

Sign-in and sign-up call the real backend:

- `POST /auth/signin` → returns JWT + user object
- `POST /auth/signup` → creates account, then auto sign-in

Session stored in `localStorage`:

| Key | Purpose |
|-----|---------|
| `workmate_token` | JWT (primary auth check) |
| `workmate_current_user_email` | User email |
| `workmate_user_role` | `candidate` or `employer` |
| `workmate_user_id` | Numeric user ID for API calls |

Protected requests send `Authorization: Bearer <token>`.

---

## Integration Status (summary)

| Area | Status |
|------|--------|
| Auth, jobs, applications, saved jobs | API wired |
| Profiles + resume upload | API wired |
| Posts feed | API wired |
| AI recommendations (jobs + candidates) | API wired |
| Dashboard news ticker | API wired |
| News pages (`/news`, `/news/:id`) | Still mock |
| Navbar search & notifications | Still mock |
| Settings, My Network, placeholder routes | Coming soon |

See [`CLAUDE.md`](CLAUDE.md) for the full integration matrix and [`backend/README.md`](backend/README.md) for API endpoint details.

---

## Page Routes

| Route | Page | Role |
|-------|------|------|
| `/` | Landing | Guest |
| `/login` | Sign in / Sign up | Guest |
| `/dashboard` | Main home | Both |
| `/recommended-jobs` | Job recommendations | Candidate |
| `/recommended-candidates` | Candidate recommendations | Employer |
| `/job/:id` | Job detail | Both |
| `/job/:id/application` | Apply for job | Candidate |
| `/post-job` | Create job listing | Employer |
| `/applications` | Saved/applied jobs or posted jobs | Both |
| `/profile` | Profile editor | Both |
| `/post` | Social feed | Both |
| `/news` | News feed | Both |
| `/news/:id` | News article | Both |
| `/help` | Help center | Both |
| `/settings`, `/mynetwork` | Coming soon | Both |
| `/hr-news`, `/subscription`, `/portal`, `/privacy`, `/terms`, `/lawyers-corners` | Placeholders | Both |
