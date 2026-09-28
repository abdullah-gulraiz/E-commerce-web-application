import { useState } from 'react';
import styles from './ProductGallery.module.css';
import { mediaUrl } from '../api/apiClient';

export default function ProductGallery({ images, title }) {
  const [activeImage, setActiveImage] = useState(0);
  const imageUrls = (images || []).map((img) => mediaUrl(img));

  if (imageUrls.length === 0) {
    return (
      <div className={styles.wrap}>
        <div className={styles.mainImageWrap}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
              background: '#f5f5f5',
              color: '#999',
            }}
          >
            No image available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.mainImageWrap}>
        <img src={imageUrls[activeImage]} alt={title} className={styles.mainImage} />
      </div>

      {imageUrls.length > 1 && (
        <div className={styles.thumbRow}>
          {imageUrls.map((image, index) => (
            <button
              key={image + index}
              type="button"
              className={`${styles.thumbBtn} ${index === activeImage ? styles.thumbActive : ''}`}
              onClick={() => setActiveImage(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={image} alt="" className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
