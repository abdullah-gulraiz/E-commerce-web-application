import ProductCard from './ProductCard';
import EmptyState from './EmptyState';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}