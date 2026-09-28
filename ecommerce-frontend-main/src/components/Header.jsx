import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { logout } from '../feature/auth/authSlice';
import { clearCart } from '../feature/cart/cartSlice';
import { getallCartItems } from '../feature/cart/cartThunk';
import { useDispatch, useSelector } from 'react-redux';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items) || [];
  const [searchTerm, setSearchTerm] = useState('');

  // Keep the badge count in sync with the server-side cart when the header mounts.
  useEffect(() => {
    dispatch(getallCartItems());
  }, [dispatch]);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login', { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    // The shop page reads ?q= from the URL and triggers the search thunk.
    navigate(`/layout/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/layout/shop" className={styles.wordmark}>
          Yonder
        </Link>

        <nav className={styles.nav}>
          <Link to="/layout/shop" className={styles.navLink}>
            Shop
          </Link>
        </nav>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className={styles.actions}>
          <Link to="/layout/cart" className={styles.iconBtn} aria-label="Cart">
            <svg viewBox="0 0 24 24" className={styles.icon}>
              <path
                d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9.5" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          <Link
            to="/layout/account"
            className={styles.iconBtn}
            aria-label="Account"
          >
            <svg viewBox="0 0 24 24" className={styles.icon}>
              <circle
                cx="12"
                cy="8"
                r="3.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M5 19c1.2-3.2 4-4.8 7-4.8s5.8 1.6 7 4.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
