import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getOrderById, updateOrderStatus } from '../feature/order/orderThunk';
import styles from './AdminOrderDetail.module.css';

const statusStyles = {
  pending: styles.pending,
  completed: styles.completed,
  cancelled: styles.cancelled,
};

export default function AdminOrderDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { selectedOrder: order, loading, error } = useSelector(
    (state) => state.order
  );

  const [status, setStatus] = useState('pending');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const handleSaveStatus = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      setSaveSuccess(true);
    } catch (err) {
      const message =
        typeof err === 'string'
          ? err
          : err?.message || 'Failed to update status.';
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h2>Loading…</h2>;

  if (error) {
    const errorMessage =
      typeof error === 'string' ? error : error?.message || 'Something went wrong.';
    return <h2>{errorMessage}</h2>;
  }

  if (!order) return <h2>Order not found.</h2>;

  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Order #{order._id.slice(-6)}</h1>
        <span className={`${styles.badge} ${statusStyles[status]}`}>
          {status}
        </span>
      </div>

      <p className={styles.date}>Placed on {formattedDate}</p>

      <div className={styles.layout}>
        <div className={styles.card}>
          <h2 className={styles.cardHeading}>Items</h2>

          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Line total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => {
                const qty = item.quantity ?? 0;
                const price = Number(item.product?.price) || 0;
                return (
                  <tr key={item._id}>
                    <td>{item.product?.title || 'Product removed'}</td>
                    <td>{qty}</td>
                    <td>${price.toFixed(2)}</td>
                    <td>${(price * qty).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalValue}>
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.card}>
            <h2 className={styles.cardHeading}>Customer</h2>
            <p className={styles.line}>{order.user?.name || 'Unknown user'}</p>
            <p className={styles.lineMuted}>{order.user?.email}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardHeading}>Shipping address</h2>
            <p className={styles.line}>{order.shippingAddress}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardHeading}>Update status</h2>

            <select
              className={styles.statusSelect}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={saving}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              className={styles.saveBtn}
              onClick={handleSaveStatus}
              disabled={saving || status === order.status}
            >
              {saving ? 'Saving…' : 'Save status'}
            </button>

            {saveError && <p className={styles.errorText}>{saveError}</p>}
            {saveSuccess && (
              <p className={styles.successText}>Status updated successfully.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
