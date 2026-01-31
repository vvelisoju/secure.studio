---
description: Secure.Studio (Workspace Management) - Dev + Prod Workflow
---

This repo is a 2-service workspace management system:

- **API**: `api/` (Node.js + Express + TypeScript + Prisma + Postgres)
- **Web App**: `app/` (Vite + React + TypeScript)

# 1) Prerequisites

- Node.js:
  - `api/`: Node 18 compatible
  - `app/`: Node 20 compatible
- Postgres (local or remote)
- Optional: Docker (matches GitLab CI build strategy)

# 2) Environment configuration (required)

## API (`api/.env`)
Create `api/.env` (not committed) with at least:

- `DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public`
- `PORT=4000` (local dev default; code falls back to 4000)
- `NODE_ENV=development`
- `CLIENT_URL=http://localhost:5000` (your Vite dev URL)
- `SERVER_BASE_URL=http://localhost:4000` (or whatever your API base is)
- `APP_NAME=Secure Studio`

If you use these features, also set:

- Google OAuth:
  - `GOOGLE_CLIENT_ID=...`
  - `GOOGLE_CLIENT_SECRET=...`
- Mailgun:
  - `MAILGUN_API_KEY=...`
  - `MAILGUN_DOMAIN=...`
  - `MAILGUN_FROM=...`
- S3/DigitalOcean Spaces uploads:
  - `S3Storage=true|false`
  - `S3_BUCKET=...`
  - `S3_REGION=...`
  - `S3_ACCESS_KEY_ID=...`
  - `S3_SECRET_ACCESS_KEY=...`
- Razorpay:
  - `RAZORPAY_KEY_ID=...`
  - `RAZORPAY_KEY_SECRET=...`
  - `RAZORPAY_WEBHOOK_SECRET=...`

## Web App (`app/.env`)
Create `app/.env` (not committed) with:

- `VITE_API_BASE_URL=http://localhost:4000`

The frontend Axios base URL becomes:

- `${VITE_API_BASE_URL}/api`

# 3) Install dependencies

## API
From repo root:

1. `cd api`
2. `npm ci`

## App
From repo root:

1. `cd app`
2. `npm ci`

If you hit peer dependency resolution issues on Windows, use:

- `npm ci --legacy-peer-deps`

# 4) Database setup (Prisma)

From `api/`:

1. Generate Prisma client:
   - `npx prisma generate`
2. Apply migrations (recommended for dev):
   - `npx prisma migrate dev`
3. Seed data (uses `prisma/seed.mjs`):
   - `npx prisma db seed`

# 5) Run locally (development)

Run both services in separate terminals.

## Terminal A: API
From `api/`:

- `npm run dev`

Default: `http://localhost:4000`

## Terminal B: App
From `app/`:

- `npm run dev`

Vite is configured to listen on:

- `http://localhost:5000`

# 6) Lint + production builds

## App build
From `app/`:

- Lint: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`

## API build
From `api/`:

- Build: `npm run build`
- Start (runs `dist/server.js`): `npm run start`

# 7) Docker builds (matches GitLab CI)

Your `.gitlab-ci.yml` builds images from `./api` and `./app`.

## Build API image
From repo root:

- `docker build -t secure-studio-api:local ./api`

## Build App image
From repo root:

- `docker build -t secure-studio-app:local --build-arg VITE_API_BASE_URL=http://localhost:4000 ./app`

# 8) Production run notes

- The API Dockerfiles expose port `5000`, but `server.ts` defaults to `4000` unless `PORT` is set.
  - In production containers, ensure `PORT=5000` if you want to match the Dockerfile `EXPOSE 5000`.
- The App container serves via nginx and exposes `3010`.
