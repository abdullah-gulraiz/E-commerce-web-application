import axios from 'axios';

// ---------------------------------------------------------------------------
// The ONE place the backend URL is configured.
//
// Local dev  : create a .env file with  VITE_API_URL=http://localhost:5000
// Production : set VITE_API_URL in Vercel → Settings → Environment Variables
//              e.g. https://ecommerce-backend.vercel.app
//
// Vite inlines import.meta.env.* at build time, so changing the value in
// Vercel requires a redeploy (not just a restart).
// ---------------------------------------------------------------------------
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

// Shared axios instance. Thunks keep their own endpoint paths ('/cart/add',
// '/products/all', ...) and just import this instead of raw axios.
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT to every request, so individual thunks no longer need to
// build their own getTokenConfig() header object.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend returns 401 (invalid/expired token), clear local session and
// redirect to the login screen. This keeps the UI in sync with the server.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if we're not already on a public page — avoids loops.
      const publicPaths = ['/', '/login', '/register', '/admin'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Product/category images. New uploads are absolute Cloudinary URLs; older
// records still hold a relative 'uploads/xyz.jpg' path served by the backend.
export const mediaUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`;
};

export default api;
