import styles from './Login.module.css';
import { useState, useEffect } from 'react';
import { loginUser } from '../feature/auth/auththunk';
import { clearAuthError } from '../feature/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector((s) => s.auth);

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Clear any lingering error when this page mounts
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Redirect once the login succeeds, sending admins to the admin panel.
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/adminlayout/products', { replace: true });
      } else {
        navigate('/layout/shop', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginData));
  };

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <span className={styles.wordmark}>Yonder</span>
        <span className={styles.est}>EST. 2026</span>
      </header>

      <main className={styles.stage}>
        <div className={styles.card}>
          <div className={styles.stamp}>
            <span>Y</span>
          </div>

          <p className={styles.tag}>Returning customer &mdash; parcel pickup</p>
          <h1 className={styles.headline}>Welcome back.</h1>
          <p className={styles.sub}>Sign in to continue where you left off.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Password</label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  padding: '10px 12px',
                  background: '#fee',
                  color: '#a00',
                  borderRadius: 6,
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                {error}
              </div>
            )}

            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className={styles.switchText}>
            New to Yonder?{' '}
            <Link to="/register" className={styles.linkBtn}>
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>Shipped daily, no minimum order.</span>
      </footer>
    </div>
  );
}
