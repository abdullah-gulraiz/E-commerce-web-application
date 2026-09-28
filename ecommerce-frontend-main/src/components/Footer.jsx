import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerCol}>
          <span className={styles.wordmark}>Yonder</span>
          <p className={styles.footerText}>Everyday goods, from everywhere.</p>
        </div>

        <div className={styles.footerCol}>
          <span className={styles.footerHeading}>Shop</span>
          <Link to="/layout/shop" className={styles.footerLink}>
            All products
          </Link>
        </div>

        <div className={styles.footerCol}>
          <span className={styles.footerHeading}>Account</span>
          <Link to="/layout/account" className={styles.footerLink}>
            My account
          </Link>
          <Link to="/layout/cart" className={styles.footerLink}>
            My cart
          </Link>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>&copy; {year} Yonder. Shipped daily, no minimum order.</span>
      </div>
    </footer>
  );
}
