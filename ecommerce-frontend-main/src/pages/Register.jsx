import styles from './Register.module.css';
import { useState, useEffect } from 'react';
import { registerUser } from '../feature/auth/auththunk';
import { clearAuthError } from '../feature/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [clientError, setClientError] = useState(null);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // A successful signup returns a token, which flips isAuthenticated.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/layout/shop', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setClientError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError(null);

    if (!userData.name.trim() || !userData.email.trim() || !userData.password) {
      setClientError('Name, email and password are required.');
      return;
    }
    if (userData.password.length < 6) {
      setClientError('Password must be at least 6 characters.');
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      setClientError('Passwords do not match.');
      return;
    }

    const { confirmPassword, ...payload } = userData;
    dispatch(registerUser(payload));
  };

  const displayError = clientError || error;

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

          <p className={styles.tag}>New account &mdash; parcel intake</p>
          <h1 className={styles.headline}>Open your account.</h1>
          <p className={styles.sub}>Fill in your details to start ordering.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Jordan Blake"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={userData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                  disabled={loading}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">
                Phone <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={userData.phone}
                onChange={handleInputChange}
                placeholder="+1 555 123 4567"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="address">
                Address <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                placeholder="Street, city, postal code"
                value={userData.address}
                onChange={handleInputChange}
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
                  marginBottom: 4,
                }}
              >
                {displayError}
              </div>
            )}

            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.linkBtn}>
              Sign in
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
