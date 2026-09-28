const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, updateCartItemQuantity, viewAllCartItems } = require('../controller/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const userMiddleware = require('../middleware/userMiddleware');

//user routes
router.post('/add', authMiddleware, userMiddleware, addToCart);
router.delete('/remove', authMiddleware, userMiddleware, removeFromCart);
router.put('/update', authMiddleware, userMiddleware, updateCartItemQuantity);
router.get('/', authMiddleware, userMiddleware, viewAllCartItems);

module.exports = router;