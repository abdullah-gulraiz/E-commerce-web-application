# Changes Made During the Audit & Fix

This document lists every change made to the original project during the audit-and-fix pass. Grouped by area, with the reason each change was necessary.

---

## 🔒 Security Fixes (Critical)

### 1. Removed real Cloudinary credentials from `.env.example`
- **File:** `ecommerce-backend-main/.env.example`
- **Before:** File contained real values (`CLOUDINARY_CLOUD_NAME=utjhimje`, real API key, real API secret).
- **After:** Placeholders only (`<your-cloud-name>`, etc.).
- **Action required:** If you already pushed the original repo to GitHub, rotate the Cloudinary API secret from the Cloudinary dashboard.

### 2. Blocked admin role escalation on signup
- **File:** `ecommerce-backend-main/controller/authController.js`
- **Before:** `signup` destructured `role` from `req.body` and passed it to the User model. Anyone could POST `{ role: "admin" }` and become an admin.
- **After:** `role` is no longer read from the request; it's hard-coded to `'user'`. Admins must be created directly in MongoDB (see README).

### 3. Removed password from all API responses
- **File:** `ecommerce-backend-main/controller/authController.js`
- **After:** A `publicUser()` helper strips the password hash before returning any user object. `getProfile` also uses `.select('-password')`.

### 4. Generic login error message
- **Before:** Backend returned `"Invalid email"` vs `"Invalid password"`, revealing whether an email was registered.
- **After:** Both cases return the same `"Invalid credentials"` message.

### 5. Server-side order pricing
- **File:** `ecommerce-backend-main/controller/orderController.js`
- **Before:** Client sent `items`, `totalAmount`, and `shippingAddress`. A malicious client could place a $10,000 order for $0.01.
- **After:** Client sends only `shippingAddress`. The server reads the cart, computes the total from live product prices, and creates the order. Cart is cleared afterward.

### 6. Ownership check on order details
- **File:** `ecommerce-backend-main/controller/orderController.js`
- **Before:** `GET /orders/:id` returned any order to any authenticated user.
- **After:** Regular users can only view their own orders; admins can view any.

### 7. Input validation on all mutating endpoints
- Added on auth, cart, order, product, category, and review endpoints.
- Email format, password length ≥ 6, rating 1–5, non-negative prices, non-empty required fields.

### 8. Regex escaping in product search
- **File:** `ecommerce-backend-main/controller/productController.js`
- **Before:** User input passed directly to `$regex`, so searches like `$50` would crash.
- **After:** All regex special characters are escaped before building the query.

### 9. Correct HTTP status for auth failures
- **File:** `ecommerce-backend-main/middleware/authMiddleware.js`
- **Before:** Invalid token returned `400`.
- **After:** Returns `401` (Unauthorized), which is the correct semantic and lets the frontend interceptor auto-logout.

---

## 🐛 Bug Fixes (Critical)

### 10. Registration flow now works end-to-end
- **Files:** backend `authController.js`, frontend `authSlice.js`, `Register.jsx`
- **Before:** Signup returned only `{ message }` (no token). Redux stored `undefined` as the token and set `isAuthenticated: true`, corrupting all subsequent requests.
- **After:** Signup returns `{ token, user }`. The user is logged in atomically, and Redux state stays consistent.

### 11. Login returns user profile
- **Files:** backend `authController.js`, frontend `authSlice.js`
- **Before:** Login returned only `{ token }`. Frontend had no way to know the user's name or role.
- **After:** Returns `{ token, user: { _id, name, email, role, phone, address } }`.

### 12. Checkout sends the correct payload
- **Files:** frontend `Checkout.jsx`, `orderThunk.js`
- **Before:** Frontend sent `{ cartItems, totalAmount, shippingAddress }` with populated cart objects. Backend expected `{ items, totalAmount, shippingAddress }` with `[{ product: ObjectId, quantity }]`. Orders failed or saved malformed.
- **After:** Frontend sends only `{ shippingAddress }`; backend builds the rest from the server-side cart.

### 13. Account page shows real user data
- **File:** frontend `Account.jsx`
- **Before:** Displayed hardcoded "Jordan Blake" sample data. "Save changes" did nothing.
- **After:** Fetches profile from `/auth/profile`, allows editing name/phone/address, and saves via `PUT /auth/profile`. Also shows the user's own order history via `/orders/me`.

### 14. Reviews display correct user names
- **Files:** frontend `ReviewItem.jsx`, `ReviewList.jsx`, backend `productController.js`
- **Before:** ReviewItem read `review.userName` and `review.id` — fields that don't exist on the API. Names were blank; React key warning.
- **After:** Reads `review.user?.name` and uses `review._id` as key. Backend populates `reviews.user` with `{ _id, name }`.

### 15. Admin routing checks the role
- **Files:** all 4 route guards (`PrivateRoute`, `PrivateAdmin`, `PublicRoute`, `AdminRoute`)
- **Before:** All four guards only checked `isAuthenticated`. A regular user could visit `/adminlayout/*` and see the admin UI (backend still blocked mutations, but the UI was confusing).
- **After:** Every guard checks the role. Non-admins are redirected to `/layout/shop`; admins to `/adminlayout/products`.

### 16. Cart quantity updates work correctly
- **Files:** backend `cartController.js`, frontend `cartThunk.js`, `Cart.jsx`, `CartItem.jsx`
- **Before:** Update was hardcoded to increment by 1; no way to decrease. Adding the same product multiple times created duplicate cart rows.
- **After:** `updateCartItemQuantity` accepts `{ productId, quantity }` and can set any value (0 = remove). Adding an existing product increments its quantity in place. Cart UI has both `+` and `−` buttons.

### 17. Cart badge shows real count
- **File:** frontend `Header.jsx`
- **Before:** Hardcoded "2" regardless of cart contents.
- **After:** Sums quantities from Redux and only shows badge when > 0.

### 18. Header search box works
- **Files:** frontend `Header.jsx`, `Home.jsx`, `productSlics.js`, `productThunk.js`
- **Before:** Input existed but had no `onChange` or `onSubmit`. Backend search endpoint was unreachable from the UI.
- **After:** Search form submits to `/layout/shop?q=...`; Home page reads the query param and dispatches `searchProducts`. A "Clear search" banner shows above results.

### 19. Footer links go to the right routes
- **File:** frontend `Footer.jsx`
- **Before:** Linked to `/categories`, `/account`, `/cart` (none of which are valid routes).
- **After:** Links to `/layout/shop`, `/layout/account`, `/layout/cart`.

### 20. Cart clears on logout
- **Files:** frontend `Header.jsx`, `AdminLayout.jsx`, `cartSlice.js`
- **Before:** Logging out left the previous user's cart items in Redux state; the next login briefly showed them.
- **After:** `clearCart` action is dispatched alongside `logout` in both customer and admin layouts.

### 21. Session survives page refresh
- **File:** frontend `authSlice.js`
- **Before:** Token was rehydrated from localStorage but user object was not, so `state.user` was null after refresh and Account page couldn't render.
- **After:** Both token and user object are persisted to localStorage on login and restored on app boot.

### 22. Auto-logout on token expiry
- **File:** frontend `apiClient.js`
- **Added:** Axios response interceptor. Any `401` response clears localStorage and redirects to `/login` (except on public pages, to avoid loops).

---

## 🧹 Code Cleanup

### 23. Removed all `sampleProducts`/`sampleCategories`/`sampleUser` dummy data
- Files: `AdminProducts.jsx`, `AdminCategories.jsx`, `AdminProductForm.jsx`, `Account.jsx`, `ProductDetail.jsx`

### 24. Removed `console.log` debug statement
- File: `cartSlice.js`

### 25. Fixed React `key` warnings
- `AdminCategories.jsx` used `key={category.id}` (undefined) → now `key={category._id}`
- `ReviewList.jsx` used `key={review.id}` → now `key={review._id}`

### 26. Confirmed responsive design
- All 20 CSS Module files already had `@media` breakpoints — no changes needed.

---

## 📄 Documentation

### 27. Full project README at repo root
- New file: `README.md`
- Sections: problem statement, features (customer + admin + security + UX), full tech stack, architecture diagram, project structure, prerequisites, local setup, environment variables, complete API documentation, deployment overview, live URL placeholders, security notes.

### 28. Updated backend DEPLOY.md
- Removed the "rotate the leaked credentials" section (no longer needed).
- Clearer step-by-step MongoDB Atlas + Cloudinary + Vercel walkthrough.

### 29. Refreshed .env.example files
- Both frontend and backend `.env.example` files now use only placeholders and include instructions for generating secrets.

### 30. New file: CHANGES.md (this document)

---

## 🎨 UX Improvements

### 31. Loading + error states on every async action
- Login, Register, AdminLogin, Cart, Checkout, ProductDetail, Home, Account, admin pages — all now show a loading indicator during requests and a visible error banner on failure.

### 32. Delete confirmation dialogs
- Admin product and category deletes now ask "Are you sure?" before firing.

### 33. Success feedback
- Account update shows a green success banner.
- Review submission shows "Review submitted. Thanks!" and clears the form.
- Order status update shows "Status updated successfully."

### 34. Empty states
- Cart, checkout, admin product list, and admin category list all show friendly empty states with call-to-action instead of blank tables.

### 35. Correct HTML `<title>` and meta description
- Was `"frontend"` → now `"Yonder — Everyday goods, from everywhere"`

### 36. Landing page auto-redirects authenticated users
- Prevents logged-in users from seeing the marketing page.

---

## ➕ New Endpoints

- `GET /auth/profile` — get authenticated user's profile
- `PUT /auth/profile` — update authenticated user's profile
- `GET /orders/me` — get authenticated user's own order history

---

## 🗑️ Removed

- `ecommerce-backend-main/uploads/` folder (~6 MB of legacy user images). Vercel has a read-only filesystem, so these files couldn't be served in production anyway. All new uploads go to Cloudinary.
- Both `package-lock.json` files. `npm install` will regenerate clean ones on first setup.

---

## 📋 What You Still Need to Do

1. **Create MongoDB Atlas cluster** and get the connection string
2. **Create Cloudinary account** and get cloud name / API key / API secret
3. **Generate a JWT secret:** `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
4. **Push both folders to GitHub** (backend and frontend, or a monorepo)
5. **Deploy to Vercel** (see each folder's `DEPLOY.md` and the root `README.md`)
6. **Create your first admin user** by manually flipping `role: "user"` → `role: "admin"` in MongoDB Atlas for one signed-up account
7. **Add the live URLs to `README.md`** once deployed

Every one of these steps is documented in detail in `README.md` and `ecommerce-backend-main/DEPLOY.md`.
