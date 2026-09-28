import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import styles from './Cart.module.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  getallCartItems,
  updateCartItemQuantity,
  removeCartItem,
} from '../feature/cart/cartThunk';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: cartItems = [], loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getallCartItems());
  }, [dispatch]);

  const handleIncrease = (productId, currentQty) => {
    dispatch(
      updateCartItemQuantity({ productId, quantity: currentQty + 1 })
    );
  };

  const handleDecrease = (productId, currentQty) => {
    // Sending quantity 0 tells the backend to remove the item.
    dispatch(
      updateCartItemQuantity({ productId, quantity: Math.max(0, currentQty - 1) })
    );
  };

  const handleRemove = (productId) => {
    dispatch(removeCartItem(productId));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (loading && cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <p>Loading your cart…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p style={{ color: '#a00' }}>
          {typeof error === 'string' ? error : error.message || 'Failed to load cart.'}
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse the shop to find something you'll love."
        actionLabel="Continue shopping"
        onAction={() => navigate('/layout/shop')}
      />
    );
  }

  return (
    <div className={styles.page}>
      <p className={styles.tag}>Cart</p>
      <h1 className={styles.heading}>Your cart</h1>

      <div className={styles.list}>
        {cartItems.map((item) => (
          <CartItem
            key={item._id || item.product._id}
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.subtotalRow}>
          <span>Subtotal</span>
          <span className={styles.subtotalValue}>${subtotal.toFixed(2)}</span>
        </div>
        <p className={styles.note}>Shipping and taxes calculated at checkout.</p>
        <button
          type="button"
          className={styles.checkoutBtn}
          onClick={() => navigate('/layout/checkout')}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
