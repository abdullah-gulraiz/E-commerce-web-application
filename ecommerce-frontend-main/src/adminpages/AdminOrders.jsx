import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllOrders } from '../feature/order/orderThunk';
import styles from './AdminOrders.module.css';

const statusStyles = {
  pending: styles.pending,
  completed: styles.completed,
  cancelled: styles.cancelled,
};

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  if (loading) return <h2>Loading orders…</h2>;
  if (error) {
    return (
      <h2>{typeof error === 'string' ? error : error.message || 'Failed to load orders.'}</h2>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Orders</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>
                <td>{order.user?.name || 'Unknown user'}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td>${Number(order.totalAmount).toFixed(2)}</td>
                <td>
                  <span
                    className={`${styles.badge} ${statusStyles[order.status] || ''}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/adminlayout/orders/${order._id}`}
                    className={styles.viewLink}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: 24 }}>
                No orders yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
