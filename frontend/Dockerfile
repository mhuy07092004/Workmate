# ── Stage: dev ──────────────────────────────────────────────────────────────
# Used by docker-compose profile "dev" for local development with HMR.
FROM node:20-alpine AS dev

WORKDIR /app

# Install dependencies first (cached layer, only rebuilds on lockfile change)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source (node_modules is shadowed by a named volume in compose)
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]


# ── Stage: builder ───────────────────────────────────────────────────────────
# Produces the static dist/ for production.
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build


# ── Stage: production ────────────────────────────────────────────────────────
# Serves dist/ with nginx; used by docker-compose profile "prod".
FROM nginx:1.27-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
