import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If already signed in, skip the landing page.
  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        user?.role === 'admin' ? '/adminlayout/products' : '/layout/shop',
        { replace: true }
      );
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.route} aria-hidden="true">
        <svg viewBox="0 0 1200 700" className={styles.routeSvg} preserveAspectRatio="none">
          <path
            className={styles.routePath}
            d="M -50 620 C 250 500, 200 260, 480 300 S 900 120, 640 340 S 380 560, 600 480 S 900 380, 1000 340"
            fill="none"
          />
          <circle className={styles.routeDot} r="6" />
        </svg>
      </div>

      <header className={styles.topBar}>
        <span className={styles.wordmark}>Yonder</span>
        <span className={styles.est}>EST. 2026</span>
      </header>

      <main className={styles.stage}>
        <div className={styles.card}>
          <div className={styles.stamp}>
            <span>Y</span>
          </div>

          <p className={styles.tag}>General store &mdash; parcel no. 04920</p>
          <h1 className={styles.headline}>Everyday goods,<br />from everywhere.</h1>
          <p className={styles.sub}>
            Sign in to pick up where you left off, or open an account to start your first order.
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => navigate('/login')}
            >
              Log in
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate('/register')}
            >
              Create account
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>Shipped daily, no minimum order.</span>
      </footer>
    </div>
  );
}
