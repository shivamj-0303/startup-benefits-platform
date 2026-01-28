# Startup Benefits Platform (Monorepo)

A monorepo containing:

- **Web** — Next.js (App Router) + TypeScript frontend in `apps/web`
- **API** — Node.js + Express backend in `apps/api` (includes a minimal `/health` route)

This is the **initial skeleton README** that will later be expanded to cover the full assignment flow.

---

## Prerequisites

- **Node.js 18+**
- **npm 9+** (workspaces support)

---

## Repository Structure

```text
apps/
  web/   # Next.js frontend
  api/   # Express backend
README.md
```

## Setup (single install for the whole repo)

```bash
npm install
```

## Run the Web App (Next.js)
### From the repo root:
```bash
npm run dev:web
```

#### Expected result
Next.js dev server starts
Web app is available at: http://localhost:{port}

## Run the API (Express)
From the repo root:
```bash
npm run dev:api
```
#### Expected result
Express server starts (commonly on port 4000)
Health endpoint is available at: http://localhost:{port}/health

## Run Both (Web + API)
From the repo root:
```bash
npm run dev
```
#### Expected result
Both servers start together concurrently
You will see logs from both processes in the same terminal