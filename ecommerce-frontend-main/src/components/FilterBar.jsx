import { useState } from 'react';
import styles from './FilterBar.module.css';

export default function FilterBar({ onApply }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleApply = () => {
    onApply({ minPrice, maxPrice });
    setDrawerOpen(false);
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => setDrawerOpen((open) => !open)}
      >
        Filters
      </button>

      <div className={`${styles.panel} ${drawerOpen ? styles.panelOpen : ''}`}>
        <div className={styles.field}>
          <label htmlFor="minPrice">Min price</label>
          <input
            id="minPrice"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="maxPrice">Max price</label>
          <input
            id="maxPrice"
            type="number"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <button type="button" className={styles.applyBtn} onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
}