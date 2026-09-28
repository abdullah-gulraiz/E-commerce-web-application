import styles from './CartItem.module.css';
import { mediaUrl } from '../api/apiClient';

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const productId = item.product?._id;
  const firstImage = item.product?.image?.[0] ?? item.product?.image;

  return (
    <div className={styles.row}>
      <div className={styles.imageWrap}>
        <img
          src={mediaUrl(firstImage)}
          alt={item.product?.title}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <p className={styles.title}>{item.product?.title}</p>
        <p className={styles.price}>${item.product?.price?.toFixed(2)}</p>
      </div>

      <div className={styles.stepper}>
        <button
          type="button"
          onClick={() => onDecrease?.(productId, item.quantity)}
          aria-label="Decrease quantity"
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span>{item.quantity}</span>
        <button
          type="button"
          onClick={() => onIncrease?.(productId, item.quantity)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <p className={styles.lineTotal}>
        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
      </p>

      <button
        type="button"
        className={styles.removeBtn}
        onClick={() => onRemove?.(productId)}
        aria-label={`Remove ${item.product?.title} from cart`}
      >
        Remove
      </button>
    </div>
  );
}
