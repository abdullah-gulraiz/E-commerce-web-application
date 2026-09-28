# Deploying the Yonder backend to Vercel

## 1. Prepare secrets

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Keep this value safe — you'll paste it into Vercel below. **Never commit it.**

## 2. Set up MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com
2. **Database Access** → add a database user with a strong password
3. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   Vercel functions don't have fixed outbound IPs, so this is required.
4. **Database** → **Connect** → **Drivers** → copy the connection string.
   Replace `<password>` with the user password, and set the database name (e.g. `/yonder`).

## 3. Set up Cloudinary

Sign up at https://cloudinary.com (free tier is plenty).
From the dashboard, note:
- **Cloud name**
- **API Key**
- **API Secret**

## 4. Push to GitHub

```bash
cd ecommerce-backend-main
git init
git add -A
git commit -m "Initial commit — Yonder backend"
git branch -M main
git remote add origin https://github.com/<your-username>/yonder-backend.git
git push -u origin main
```

## 5. Import on Vercel

Go to https://vercel.com/new → import the backend repo.

- **Framework Preset:** Other
- **Root Directory:** repo root
- **Build Command / Output Directory:** leave empty

## 6. Set environment variables

Vercel → Project → **Settings → Environment Variables**. Add each of these for **Production, Preview, and Development**:

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | the secret you generated in step 1 |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
| `CLOUDINARY_FOLDER` | `ecommerce/products` (optional) |
| `CORS_ORIGIN` | your frontend URL, e.g. `https://yonder.vercel.app` (set after frontend is deployed) |

**Do not set `PORT`** — Vercel manages that.

## 7. Deploy and verify

```bash
curl https://<your-app>.vercel.app/
# {"status":"ok","message":"Ecommerce API is running"}

curl https://<your-app>.vercel.app/products/all
```

## 8. Point the frontend at this URL

Copy the backend's Vercel URL and set it as `VITE_API_URL` in the frontend's Vercel project.

## Notes

- Free-plan functions time out after **10 seconds**. The first request after idle is slower because a fresh Mongo connection is opened; subsequent requests reuse the cached connection.
- Product images are served from Cloudinary, so they survive across deployments (unlike files in `uploads/`, which are lost because Vercel's filesystem is read-only).
- If credentials ever leak, rotate them immediately: change the MongoDB user's password, generate a new `JWT_SECRET`, regenerate Cloudinary keys.

## Running locally

```bash
cp .env.example .env    # then fill in the values
npm install
npm run dev
```
