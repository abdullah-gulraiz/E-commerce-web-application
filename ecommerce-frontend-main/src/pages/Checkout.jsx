import { useState, useEffect } from 'react';
import OrderSummaryRow from '../components/OrderSummaryRow';
import EmptyState from '../components/EmptyState';
import styles from './Checkout.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../feature/order/orderThunk';
import { getallCartItems } from '../feature/cart/cartThunk';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const cartItems = useSelector((state) => state.cart.items) || [];
  const orderLoading = useSelector((state) => state.order.loading);
  const orderError = useSelector((state) => state.order.error);
  const user = useSelector((state) => state.auth.user);

  // Prefill the shipping address from the user's profile if we have one.
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [submitError, setSubmitError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    dispatch(getallCartItems());
  }, [dispatch]);

  const handlePlaceOrder = async () => {
    setSubmitError(null);
    if (!shippingAddress.trim()) {
      setSubmitError('Please enter a shipping address.');
      return;
    }
    // The backend builds the order from the server-side cart, so we only send
    // the shipping address here. This is intentional — it prevents a client
    // from tampering with prices or item quantities.
    const result = await dispatch(placeOrder({ shippingAddress }));
    if (result.meta.requestStatus === 'fulfilled' && result.payload?._id) {
      // Cart is cleared on the backend; refresh local state.
      dispatch(getallCartItems());
      navigate(`/layout/checkout/${result.payload._id}`);
    }
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add something to your cart before checking out."
        actionLabel="Continue shopping"
        onAction={() => navigate('/layout/shop')}
      />
    );
  }

  const displayError = submitError || orderError;

  return (
    <div className={styles.page}>
      <p className={styles.tag}>Checkout</p>
      <h1 className={styles.heading}>Review and place your order</h1>

      <div className={styles.layout}>
        <div className={styles.formCol}>
          <div className={styles.card}>
            <h2 className={styles.cardHeading}>Shipping address</h2>
            <div className={styles.field}>
              <label htmlFor="shippingAddress">Deliver to</label>
              <textarea
                id="shippingAddress"
                name="shippingAddress"
                rows={3}
                required
                placeholder="Street, city, state, postal code"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                disabled={orderLoading}
              />
            </div>
          </div>
        </div>

        <div className={styles.summaryCol}>
          <div className={styles.card}>
            <h2 className={styles.cardHeading}>Order summary</h2>

            <div className={styles.rows}>
              {cartItems.map((item) => (
                <OrderSummaryRow key={item.product._id} item={item} />
              ))}
            </div>

            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalValue}>${totalAmount.toFixed(2)}</span>
            </div>

            {displayError && (
              <div
                role="alert"
                style={{
                  padding: '10px 12px',
                  background: '#fee',
                  color: '#a00',
                  borderRadius: 6,
                  fontSize: 14,
                  marginTop: 12,
                }}
              >
                {typeof displayError === 'string'
                  ? displayError
                  : displayError.message || 'Order failed.'}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              type="button"
              className={styles.placeOrderBtn}
              disabled={orderLoading}
            >
              {orderLoading ? 'Placing order…' : 'Place order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
