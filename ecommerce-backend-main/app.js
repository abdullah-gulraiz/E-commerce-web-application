require('dotenv').config();

const express = require('express');
const cors = require('cors');

const DbConnect = require('./config/database');
const authRoute = require('./routes/authRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoutes');

const app = express();

app.set('trust proxy', 1);

// CORS: set CORS_ORIGIN to a comma-separated list of allowed frontend origins.
// Leave it unset to allow any origin (fine while developing).
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : '*',
    credentials: allowedOrigins.length > 0,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Ecommerce API is running' });
});

// On serverless every request may hit a cold container, so make sure the
// database handshake has finished before any route touches a model.
app.use(async (req, res, next) => {
  try {
    await DbConnect();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(503).json({ message: 'Database unavailable. Please try again.' });
  }
});

// Routes
app.use('/auth', authRoute);
app.use('/categories', categoryRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);

// Legacy local image files. New uploads go straight to Cloudinary, but if a
// local `uploads/` folder exists (from an older install) it's served here too.
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
}

// 404
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler, so a thrown error returns JSON instead of an HTML page.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
