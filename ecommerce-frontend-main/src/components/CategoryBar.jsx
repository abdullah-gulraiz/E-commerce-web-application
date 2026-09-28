import styles from './CategoryBar.module.css';

export default function CategoryBar({ categories, active, onSelect }) {
  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.chip} ${active === 'all' ? styles.chipActive : ''}`}
        onClick={() => onSelect('all')}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          type="button"
          className={`${styles.chip} ${active === category._id ? styles.chipActive : ''}`}
          onClick={() => onSelect(category._id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}