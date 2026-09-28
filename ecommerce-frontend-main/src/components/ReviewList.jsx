import ReviewItem from './ReviewItem';
import styles from './ReviewList.module.css';

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <p className={styles.empty}>
        No reviews yet. Be the first to write one.
      </p>
    );
  }

  return (
    <div className={styles.list}>
      {reviews.map((review) => (
        <ReviewItem key={review._id} review={review} />
      ))}
    </div>
  );
}
