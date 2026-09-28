import styles from './StatusBadge.module.css';

const statusStyles = {
  pending: styles.pending,
  completed: styles.completed,
  cancelled: styles.cancelled,
};

export default function StatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${statusStyles[status] || styles.pending}`}>
      {status}
    </span>
  );
}