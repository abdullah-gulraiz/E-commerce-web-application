import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../feature/auth/auththunk';
import { getMyOrders } from '../feature/order/orderThunk';
import StatusBadge from '../components/StatusBadge';
import styles from './Account.module.css';

export default function Account() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const authError = useSelector((state) => state.auth.error);
  const { orders = [], loading: ordersLoading } = useSelector(
    (state) => state.order
  );

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load the latest profile and the user's order history on mount.
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(getMyOrders());
  }, [dispatch]);

  // Keep the form in sync when user data arrives or refreshes.
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    const result = await dispatch(updateProfile(form));
    if (result.meta.requestStatus === 'fulfilled') {
      setSaveSuccess(true);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
    setSaveSuccess(false);
  };

  if (!user) {
    return (
      <div className={styles.page}>
        <p>Loading your account…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.tag}>Account</p>
          <h1 className={styles.heading}>Your details</h1>
        </div>

        {!isEditing && (
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name">Full name</label>
            {isEditing ? (
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                disabled={authLoading}
              />
            ) : (
              <p className={styles.value}>{user.name}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            {/* Email is intentionally read-only; changing it is a separate flow. */}
            <p className={styles.value}>{user.email}</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">
              Phone <span className={styles.optional}>(optional)</span>
            </label>
            {isEditing ? (
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 123 4567"
                disabled={authLoading}
              />
            ) : (
              <p className={styles.value}>{user.phone || '—'}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="address">
              Address <span className={styles.optional}>(optional)</span>
            </label>
            {isEditing ? (
              <textarea
                id="address"
                name="address"
                rows={2}
                value={form.address}
                onChange={handleChange}
                placeholder="Street, city, postal code"
                disabled={authLoading}
              />
            ) : (
              <p className={styles.value}>{user.address || '—'}</p>
            )}
          </div>

          {authError && isEditing && (
            <div
              role="alert"
              style={{
                padding: '10px 12px',
                background: '#fee',
                color: '#a00',
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              {authError}
            </div>
          )}

          {saveSuccess && !isEditing && (
            <div
              style={{
                padding: '10px 12px',
                background: '#e6f6e6',
                color: '#155724',
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              Profile updated successfully.
            </div>
          )}

          {isEditing && (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancel}
                disabled={authLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={authLoading}
              >
                {authLoading ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Order history */}
      <div style={{ marginTop: 40 }}>
        <h2 className={styles.heading} style={{ fontSize: 24 }}>
          Your orders
        </h2>

        {ordersLoading && <p>Loading orders…</p>}

        {!ordersLoading && orders.length === 0 && (
          <p style={{ color: '#666' }}>You haven't placed any orders yet.</p>
        )}

        {!ordersLoading && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/layout/checkout/${order._id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    Order #{order._id.slice(-6)}
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · {order.items?.length || 0} item(s)
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontWeight: 600 }}>
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
