import styles from './ReviewItem.module.css';

export default function ReviewItem({ review }) {
  // The backend populates `review.user` with `{ _id, name }`.
  const name = review.user?.name || 'Anonymous';
  const rating = Number(review.rating) || 0;
  const clampedRating = Math.max(0, Math.min(5, rating));

  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        <span className={styles.stars}>
          {'★'.repeat(clampedRating)}
          {'☆'.repeat(5 - clampedRating)}
        </span>
      </div>
      <p className={styles.comment}>{review.comment}</p>
    </div>
  );
}
