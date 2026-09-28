# 🛍️ Yonder — MERN E-Commerce Application

> **Everyday goods, from everywhere.** A full-stack e-commerce web application built with the MERN stack for browsing products, managing carts, and placing orders — with a separate admin panel for catalog and order management.

---

## 📋 Table of Contents

- [Problem](#-problem)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Live URLs](#-live-urls)
- [Security Notes](#-security-notes)

---

## 🎯 Problem

Small independent retailers need an affordable, easy-to-run online storefront that separates customer-facing shopping from staff-facing catalog and order management, without paying platform fees or being locked into a hosted marketplace. Yonder is a self-hosted, MERN-based reference implementation of that store: a customer app for discovering products and placing orders, and an admin panel for staff to keep the catalog current and fulfill orders.

---

## ✨ Features

### Customer

- 🔍 Browse products with **category filtering** and **price range filtering**
- 🔎 **Full-text search** across product titles and descriptions
- 🖼️ Product detail pages with **image galleries** and **reviews**
- 🛒 **Persistent cart** stored server-side (survives logins and sessions)
- ➕/➖ Adjust cart quantities, or remove items
- ✅ **Secure checkout** with server-side price calculation (client cannot tamper)
- 📦 **Order history** with statuses (pending / completed / cancelled)
- ⭐ Post product **reviews and ratings**
- 👤 Editable **user profile** (name, phone, address)

### Admin

- 📊 Separate admin login and dashboard
- 📦 **Product CRUD** with multi-image upload (Cloudinary)
- 🏷️ **Category CRUD**
- 📋 **View all orders** and update order status
- 🖼️ Cloud-hosted product images

### Authentication & Security

- 🔐 JWT-based authentication (Bearer tokens, 1-day expiry)
- 🔒 **bcrypt password hashing** (never plaintext)
- 🛡️ Role-based access control (user / admin) on **both frontend and backend**
- 🚫 Signup cannot escalate to admin — role is server-controlled
- ⏱️ **Auto-logout** on token expiry (401 interceptor)
- 🔑 Server-side cart drives order creation (client cannot forge prices)

### UX

- 📱 **Responsive design** — works on mobile and desktop
- ⏳ Loading states on every async action
- ⚠️ Error messages surfaced on every form
- 🎨 Clean, custom UI with CSS Modules

---

## 🛠️ Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router DOM 7 |
| State management | Redux Toolkit + createAsyncThunk |
| HTTP client | Axios (with request/response interceptors) |
| Styling | CSS Modules (per-component scoped styles) |

### Backend

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 20 |
| Framework | Express 5 |
| Database | MongoDB (Atlas-ready) |
| ODM | Mongoose 9 |
| Authentication | JWT (jsonwebtoken) + bcrypt |
| File uploads | Multer (memory storage) + Cloudinary |
| CORS | cors middleware |
| Config | dotenv |

### Infrastructure

- **Frontend hosting:** Vercel (SPA rewrites configured)
- **Backend hosting:** Vercel (serverless functions)
- **Database:** MongoDB Atlas
- **Image storage:** Cloudinary

---

## 🏗️ Architecture

```
┌──────────────────┐   HTTPS + JWT Bearer   ┌──────────────────┐
│                  │ ─────────────────────► │                  │
│  React Frontend  │                        │  Express API     │
│  (Vite / Vercel) │ ◄───────────────────── │  (Vercel funcs)  │
│                  │       JSON             │                  │
└──────────────────┘                        └────────┬─────────┘
                                                     │
                                        Mongoose     │
                                                     ▼
                                            ┌──────────────────┐
                                            │  MongoDB Atlas   │
                                            └──────────────────┘
                                                     ▲
                                                     │ Product images
                                            ┌────────┴─────────┐
                                            │    Cloudinary    │
                                            └──────────────────┘
```

**Data flow for a purchase:**

```
User adds items → POST /cart/add → Server persists cart
User checks out → POST /orders/place with shippingAddress
    → Server reads user's cart, computes total, creates order, clears cart
    → Response includes populated order → Frontend navigates to confirmation
```

---

## 📁 Project Structure

```
yonder/
├── ecommerce-backend-main/
│   ├── api/
│   │   └── index.js              # Vercel serverless entry
│   ├── app.js                    # Express app setup (routes, middleware)
│   ├── index.js                  # Local dev entry (calls app.listen)
│   ├── config/
│   │   ├── database.js           # Cached Mongoose connection (serverless-friendly)
│   │   └── cloudinary.js         # Cloudinary SDK config
│   ├── controller/               # Route handlers
│   │   ├── authController.js     # Signup, login, profile
│   │   ├── productController.js  # Product CRUD, search, filter, pagination
│   │   ├── categoryController.js # Category CRUD
│   │   ├── cartController.js     # Cart operations
│   │   └── orderController.js    # Order placement, listing, status update
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── adminMiddleware.js    # Role guard: admin only
│   │   ├── userMiddleware.js     # Role guard: user only
│   │   └── uploadMiddleware.js   # Multer + Cloudinary upload pipeline
│   ├── model/                    # Mongoose schemas
│   │   ├── user.js
│   │   ├── product.js
│   │   ├── category.js
│   │   ├── cart.js
│   │   └── order.js
│   ├── routes/                   # Express routers
│   ├── .env.example              # Env var template (placeholders only)
│   ├── package.json
│   └── vercel.json               # Vercel rewrites
│
└── ecommerce-frontend-main/
    ├── index.html
    ├── vite.config.js
    ├── vercel.json               # SPA fallback rewrite
    ├── src/
    │   ├── main.jsx              # App entry
    │   ├── App.jsx
    │   ├── api/
    │   │   └── apiClient.js      # Axios instance + JWT interceptor
    │   ├── app/
    │   │   └── store.js          # Redux store
    │   ├── feature/              # Redux slices + thunks
    │   │   ├── auth/
    │   │   ├── product/
    │   │   ├── category/
    │   │   ├── cart/
    │   │   └── order/
    │   ├── pages/                # Route pages (Home, Login, Cart, etc.)
    │   ├── adminpages/           # Admin-only pages
    │   ├── components/           # Reusable UI (16+ components)
    │   ├── layouts/              # Layout wrappers (customer, admin)
    │   └── routes/               # Route guards (PrivateRoute, PrivateAdmin, etc.)
    ├── .env.example
    └── package.json
```

---

## ✅ Prerequisites

- **Node.js ≥ 20**
- **npm** (comes with Node)
- **MongoDB Atlas** account ([free tier is fine](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account ([free tier is fine](https://cloudinary.com/users/register/free))
- A Git client and a **GitHub** account (for deployment)

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/yonder.git
cd yonder
```

### 2. Backend setup

```bash
cd ecommerce-backend-main
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
npm install
npm run dev
```

The API will start at **http://localhost:5000**.
Verify with: `curl http://localhost:5000/` → `{"status":"ok","message":"Ecommerce API is running"}`

### 3. Frontend setup (in a separate terminal)

```bash
cd ecommerce-frontend-main
cp .env.example .env
# Default value (VITE_API_URL=http://localhost:5000) is fine for local dev
npm install
npm run dev
```

The frontend will start at **http://localhost:5173** (or the next free port).

### 4. Create an admin user

Admins cannot be created through the signup form (a security guarantee). Create one directly in MongoDB Atlas:

1. Sign up a normal account through the app
2. Open Atlas → Collections → `users` → find the document
3. Change `"role": "user"` to `"role": "admin"`, save
4. Log out and log in via `/admin` in the app

---

## 🔑 Environment Variables

### Backend (`ecommerce-backend-main/.env`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Local dev port | `5000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/yonder` |
| `JWT_SECRET` | Secret for signing JWTs (long random string) | Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | `mycloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcXYZ...` |
| `CLOUDINARY_FOLDER` | Folder for uploaded images | `ecommerce/products` |
| `CORS_ORIGIN` | Allowed frontend origin (production) | `https://yonder.vercel.app` |

### Frontend (`ecommerce-frontend-main/.env`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Base URL of the backend API (no trailing slash) | `http://localhost:5000` or `https://yonder-api.vercel.app` |

**⚠️ Never commit `.env` files.** Both `.gitignore` files exclude them; only `.env.example` (with placeholders) is versioned.

---

## 📡 API Documentation

Base URL: `http://localhost:5000` (local) or `https://<your-backend>.vercel.app` (production)

All authenticated endpoints require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Auth (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | Public | Register new user. Body: `{ name, email, password, phone?, address? }`. Returns `{ token, user }`. |
| POST | `/auth/login` | Public | Log in. Body: `{ email, password }`. Returns `{ token, user }`. |
| GET | `/auth/profile` | User | Get current user's profile. |
| PUT | `/auth/profile` | User | Update profile. Body: `{ name?, phone?, address? }`. |

### Products (`/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products/all` | Public | List all products. |
| GET | `/products/:id` | Public | Get one product with reviews. |
| GET | `/products/search?query=<q>` | Public | Search by title/description. |
| GET | `/products/filter?category=<id>&minPrice=<n>&maxPrice=<n>` | Public | Filter products. |
| GET | `/products/pagination?page=<n>&limit=<n>` | Public | Paginated product list. |
| POST | `/products/add` | Admin | Create product. Multipart: `title, description, price, category, image[]`. |
| PUT | `/products/update/:id` | Admin | Update product. |
| DELETE | `/products/delete/:id` | Admin | Delete product. |
| POST | `/products/review/:id` | User | Add a review. Body: `{ rating, comment }`. |

### Categories (`/categories`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories/` | Public | List categories. |
| POST | `/categories/` | Admin | Create. Body: `{ name }`. |
| PUT | `/categories/:id` | Admin | Update. |
| DELETE | `/categories/:id` | Admin | Delete. |

### Cart (`/cart`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/cart/` | User | Get current cart (populated). |
| POST | `/cart/add` | User | Add item. Body: `{ productId, quantity? }`. |
| PUT | `/cart/update` | User | Set quantity. Body: `{ productId, quantity }`. |
| DELETE | `/cart/remove` | User | Remove item. Body: `{ productId }`. |

### Orders (`/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders/place` | User | Place order from cart. Body: `{ shippingAddress }`. |
| GET | `/orders/me` | User | Own order history. |
| GET | `/orders/:id` | User (own) / Admin | Get one order. |
| GET | `/orders/` | Admin | All orders. |
| PUT | `/orders/:id/status` | Admin | Update status. Body: `{ status: 'pending'\|'completed'\|'cancelled' }`. |

---

## 🌍 Deployment

Both projects are pre-configured for **Vercel**. Each has a detailed guide:

- **Backend:** see [`ecommerce-backend-main/DEPLOY.md`](./ecommerce-backend-main/DEPLOY.md)
- **Frontend:** see [`ecommerce-frontend-main/DEPLOY.md`](./ecommerce-frontend-main/DEPLOY.md)

### Quick summary

1. **MongoDB Atlas:** create a cluster, add a DB user, add `0.0.0.0/0` to Network Access, copy the connection string.
2. **Cloudinary:** create an account, note the cloud name / API key / API secret.
3. **Push both folders to separate GitHub repos** (or one monorepo with two Vercel projects).
4. **Deploy backend to Vercel:** set env vars listed above, deploy. Note the assigned URL.
5. **Deploy frontend to Vercel:** set `VITE_API_URL` to the backend URL, deploy.
6. **Set backend `CORS_ORIGIN`** to the frontend URL. Redeploy backend.
7. Test: sign up, log in, add a product (as admin), buy it (as user).

---

## 🌐 Live URLs

> **Fill these in after deployment:**

- **Frontend:** _(add your Vercel URL here)_
- **Backend:** _(add your Vercel URL here)_
- **GitHub repository:** _(add repo URL here)_

---

## 🔐 Security Notes

This project follows these security practices:

- ✅ Passwords hashed with **bcrypt** (never stored in plaintext)
- ✅ JWTs signed with a strong secret, 1-day expiry
- ✅ Signup **cannot escalate to admin** — role is server-controlled
- ✅ **Generic login errors** (does not reveal whether email exists)
- ✅ **Server-side cart** drives order pricing (client cannot forge prices)
- ✅ Users can only view their own orders; admins can view all
- ✅ Password field **excluded from all API responses**
- ✅ Input validation on all mutating endpoints
- ✅ CORS restricted to configured origin in production
- ✅ **Regex escaping** in product search to prevent injection

**Never commit** `.env` files, MongoDB URIs, JWT secrets, Cloudinary credentials, or API keys. If credentials leak, rotate them immediately (see `ecommerce-backend-main/DEPLOY.md` for the rotation checklist).

---

## 📄 License

This project was built as an internship final assignment. Feel free to fork, learn from, and adapt.

---

## 🙋 Author

Built by **Farrukh** as the final project for a full-stack MERN internship.
