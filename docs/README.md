## Run Frontend Locally

```bash
cd fe
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Run Frontend with Docker

```bash
cd fe

# Development (HMR)
docker compose --profile dev up --build
# → http://localhost:5173

# Production (nginx)
docker compose --profile prod up --build
# → http://localhost:8080
```

