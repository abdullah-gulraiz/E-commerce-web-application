# Yonder — Frontend

React + Vite frontend for the Yonder MERN e-commerce app.

**For the full project overview, features, and architecture, see the [root README](../README.md).**

## Quick start

```bash
cp .env.example .env
# Default VITE_API_URL=http://localhost:5000 is fine for local development
npm install
npm run dev
```

Then open **http://localhost:5173** (or the next free port that Vite picks).

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Environment variables

See [`.env.example`](./.env.example). The only variable is `VITE_API_URL` — the backend base URL, with no trailing slash.

## Deployment

See [`DEPLOY.md`](./DEPLOY.md) for the Vercel walkthrough.

## Stack

- React 19
- Vite 8
- React Router DOM 7
- Redux Toolkit + createAsyncThunk
- Axios (centralized `apiClient` with JWT interceptor and 401 auto-logout)
- CSS Modules (per-component scoped styles)
