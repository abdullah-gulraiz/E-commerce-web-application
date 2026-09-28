# Deploying the frontend to Vercel

## Changing the backend URL

There is exactly one place: `VITE_API_URL`, read by [src/api/apiClient.js](src/api/apiClient.js).

- **Locally** — edit `.env` in this folder, then restart `npm run dev`.
- **On Vercel** — Settings → Environment Variables → `VITE_API_URL`, then redeploy.

Vite inlines `import.meta.env.*` at build time, so a changed value on Vercel
only takes effect after a new deployment (Deployments → ⋯ → Redeploy).

No trailing slash: `https://my-backend.vercel.app`, not `.../`.

## 1. Push to GitHub

```bash
git add -A
git commit -m "Centralise API base URL; prepare for Vercel"
git push
```

## 2. Import on Vercel

https://vercel.com/new → import the frontend repo.

- Framework Preset: **Vite** (auto-detected)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 3. Set the environment variable

| Variable | Value |
| --- | --- |
| `VITE_API_URL` | `https://<your-backend>.vercel.app` |

Add it for Production, Preview and Development.

## 4. Point the backend back at this domain

Once Vercel gives you the frontend URL, set it on the **backend** project:

| Variable | Value |
| --- | --- |
| `CORS_ORIGIN` | `https://<your-frontend>.vercel.app` |

Redeploy the backend. Until this is set the backend allows `*`, which works but
disables credentialed requests.

## Notes

- `vercel.json` rewrites every path to `/index.html` so React Router deep links
  (`/layout/shop/<id>`, refreshing on `/cart`, …) don't 404.
- Product images: new uploads are absolute Cloudinary URLs and work anywhere.
  Legacy `uploads/...` paths are rewritten to `${VITE_API_URL}/uploads/...` by
  `mediaUrl()`, and will 404 because Vercel's filesystem is read-only —
  re-upload those products through the admin panel.
- `npm run lint` reports pre-existing unused-variable errors. They do not
  affect `npm run build` or the Vercel deployment.
