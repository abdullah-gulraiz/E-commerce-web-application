import styles from './OrderSummaryRow.module.css';

export default function OrderSummaryRow({ item }) {
  const price = Number(item.product?.price) || 0;
  const qty = item.quantity || 0;

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <p className={styles.title}>{item.product?.title || 'Product removed'}</p>
        <p className={styles.qty}>Qty {qty}</p>
      </div>
      <p className={styles.lineTotal}>${(price * qty).toFixed(2)}</p>
    </div>
  );
}
