const Cart = require('../model/cart');
const Product = require('../model/product');

// Return the user's cart, always populated so the frontend can render
// prices and titles immediately.
const sendCart = (cart, res, status = 200) =>
  Cart.findById(cart._id)
    .populate('items.product')
    .then((populated) => res.status(status).json(populated));

const addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product id is required.' });
  }

  try {
    // Make sure the product exists before adding it to a cart.
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const qty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

    // If the item is already in the cart, increment its quantity instead of
    // creating a duplicate row.
    const existing = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    return sendCart(cart, res);
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product id is required.' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    return sendCart(cart, res);
  } catch (error) {
    console.error('removeFromCart error:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a cart item's quantity. Client sends { productId, quantity }.
 * A quantity of 0 or less removes the item.
 */
const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Accept both { productId, quantity } and legacy { id } (increment-by-one)
    const productId = req.body.productId || req.body.id;
    const rawQuantity = req.body.quantity;

    if (!productId) {
      return res.status(400).json({ message: 'Product id is required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (rawQuantity === undefined) {
      // Legacy behaviour: increment by 1
      item.quantity += 1;
    } else {
      const q = Number(rawQuantity);
      if (!Number.isFinite(q)) {
        return res.status(400).json({ message: 'Quantity must be a number.' });
      }
      if (q <= 0) {
        // Treat as a remove
        cart.items = cart.items.filter(
          (i) => i.product.toString() !== productId
        );
      } else {
        item.quantity = q;
      }
    }

    await cart.save();
    return sendCart(cart, res);
  } catch (error) {
    console.error('updateCartItemQuantity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const viewAllCartItems = async (req, res) => {
  const userId = req.user.userId;
  try {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      // Auto-create an empty cart so the frontend never has to handle 404.
      cart = await Cart.create({ user: userId, items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('viewAllCartItems error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  viewAllCartItems,
};
