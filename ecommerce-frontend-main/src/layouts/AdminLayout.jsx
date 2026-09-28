import { Outlet, Link, useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import { useDispatch } from 'react-redux';
import { logout } from '../feature/auth/authSlice';
import { clearCart } from '../feature/cart/cartSlice';

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/admin', { replace: true });
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <p className={styles.logo}>Yonder Admin</p>

        <nav className={styles.nav}>
          <Link to="/adminlayout/products" className={styles.navLink}>
            Products
          </Link>
          <Link to="/adminlayout/categories" className={styles.navLink}>
            Categories
          </Link>
          <Link to="/adminlayout/orders" className={styles.navLink}>
            Orders
          </Link>
        </nav>

        <button
          type="button"
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          Log out
        </button>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
