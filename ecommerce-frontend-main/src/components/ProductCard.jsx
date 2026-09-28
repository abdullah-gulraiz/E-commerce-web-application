import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { mediaUrl } from '../api/apiClient';

export default function ProductCard({ product }) {
  const { _id, title, price, image } = product;
  const imageUrl = image?.[0] ? mediaUrl(image[0]) : '';

  return (
    <Link to={`/layout/shop/${_id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} className={styles.image} />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: '#f5f5f5',
              color: '#999',
              fontSize: 14,
            }}
          >
            No image
          </div>
        )}
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{title}</p>
        <p className={styles.price}>${Number(price).toFixed(2)}</p>
      </div>
    </Link>
  );
}
