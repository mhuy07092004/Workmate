## Run Frontend Locally

```bash
cd fe
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Run with Docker

Run from the **repo root** (`Workmate/`):

```bash
# Development (Vite HMR)
docker compose --profile dev up --build
# → http://localhost:5173

# Production (nginx)
docker compose --profile prod up --build
# → http://localhost:8080
```

