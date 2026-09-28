import { useState } from 'react';
import styles from './ReviewForm.module.css';
import { useDispatch } from 'react-redux';
import { addReview, getProductById } from '../feature/product/productThunk';

export default function ReviewForm({ id }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFeedback({ type: 'error', message: 'Please write a comment.' });
      return;
    }
    setSubmitting(true);
    setFeedback(null);

    const reviewData = { rating, comment: comment.trim() };
    const result = await dispatch(addReview({ id, reviewData }));

    setSubmitting(false);
    if (result.meta.requestStatus === 'fulfilled') {
      setComment('');
      setRating(5);
      setFeedback({ type: 'success', message: 'Review submitted. Thanks!' });
      // Refresh the product so the new review shows up in the list.
      dispatch(getProductById(id));
    } else {
      setFeedback({
        type: 'error',
        message:
          result.payload?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          disabled={submitting}
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Bad</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          rows={3}
          placeholder="Share your thoughts on this product"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitting}
        />
      </div>

      {feedback && (
        <div
          role="alert"
          style={{
            padding: '10px 12px',
            background: feedback.type === 'success' ? '#e6f6e6' : '#fee',
            color: feedback.type === 'success' ? '#155724' : '#a00',
            borderRadius: 6,
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          {feedback.message}
        </div>
      )}

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
