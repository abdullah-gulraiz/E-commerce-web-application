import styles from './AdminLogin.module.css';
import { useState, useEffect } from 'react';
import { loginUser } from '../feature/auth/auththunk';
import { clearAuthError, logout } from '../feature/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleError, setRoleError] = useState(null);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/adminlayout/products', { replace: true });
      } else {
        // A regular user tried to log in via the admin page — reject.
        setRoleError('This account does not have admin access.');
        dispatch(logout());
      }
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRoleError(null);
    dispatch(loginUser({ email, password }));
  };

  const displayError = roleError || error;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Admin sign in</h1>
        <p className={styles.sub}>Restricted access. Authorized staff only.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="admin@yonder.com"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Password"
              disabled={loading}
            />
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
              }}
            >
              {displayError}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className={styles.footerNote}>Yonder Admin Panel</p>
    </div>
  );
}
