import OrderSummaryRow from '../components/OrderSummaryRow';
import StatusBadge from '../components/StatusBadge';
import styles from './OrderDetail.module.css';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getOrderById } from '../feature/order/orderThunk';

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedOrder: order, loading, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  if (loading) return <div className={styles.page}><h2>Loading…</h2></div>;

  if (error) {
    return (
      <div className={styles.page}>
        <h2 style={{ color: '#a00' }}>
          {typeof error === 'string' ? error : error.message || 'Failed to load order.'}
        </h2>
        <Link to="/layout/account">Back to account</Link>
      </div>
    );
  }

  if (!order) return <div className={styles.page}><h2>Order not found.</h2></div>;

  return (
    <div className={styles.page}>
      <p className={styles.tag}>Order confirmation</p>

      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Order #{order._id.slice(-6)}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className={styles.layout}>
        <div className={styles.card}>
          <h2 className={styles.cardHeading}>Items</h2>

          <div className={styles.rows}>
            {order.items.map((item) => (
              <OrderSummaryRow key={item._id} item={item} />
            ))}
          </div>

          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalValue}>
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardHeading}>Shipping address</h2>
          <p className={styles.address}>{order.shippingAddress}</p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link to="/layout/shop">Continue shopping</Link>
        {' · '}
        <Link to="/layout/account">View all orders</Link>
      </div>
    </div>
  );
}
