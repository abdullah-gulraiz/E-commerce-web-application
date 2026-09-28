const Order = require('../model/order');
const Cart = require('../model/cart');

/**
 * Place an order for the authenticated user.
 *
 * The client sends ONLY the shipping address. Items and total are calculated
 * on the server from the user's cart — this prevents a malicious client from
 * placing an order for $0.01 or for items they never added.
 */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shippingAddress } = req.body;

    if (!shippingAddress || typeof shippingAddress !== 'string' || !shippingAddress.trim()) {
      return res.status(400).json({ message: 'Shipping address is required.' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // Build order items from the populated cart and compute total server-side.
    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      shippingAddress: shippingAddress.trim(),
    });
    await newOrder.save();

    // Clear the cart after successful order placement.
    cart.items = [];
    await cart.save();

    // Return the order with populated product info so the confirmation page renders.
    const populated = await Order.findById(newOrder._id)
      .populate('items.product', 'title price image');

    res.status(201).json(populated);
  } catch (error) {
    console.error('placeOrder error:', error);
    res.status(400).json({ message: error.message });
  }
};

const orderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // A regular user can only view their own orders. Admins can view any.
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(order);
  } catch (error) {
    console.error('orderDetails error:', error);
    res.status(400).json({ message: error.message });
  }
};

// A user's own order history — used by the Account page.
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product', 'title price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('getMyOrders error:', error);
    res.status(400).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('items.product', 'title price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(400).json({ message: error.message });
  }
};

const viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'title price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('viewAllOrders error:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  orderDetails,
  getMyOrders,
  updateOrderStatus,
  viewAllOrders,
};
