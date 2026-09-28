const express = require('express');
const {
  placeOrder,
  orderDetails,
  getMyOrders,
  updateOrderStatus,
  viewAllOrders,
} = require('../controller/orderController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');

// Admin — must come BEFORE the '/:id' route or 'me' would be treated as an id
router.get('/', authMiddleware, adminMiddleware, viewAllOrders);

// User — their own order history
router.get('/me', authMiddleware, userMiddleware, getMyOrders);

// User — place an order (server builds items from the cart)
router.post('/place', authMiddleware, userMiddleware, placeOrder);

// Both — user can view own order, admin can view any (enforced in controller)
router.get('/:id', authMiddleware, orderDetails);

// Admin — update an order's status
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
