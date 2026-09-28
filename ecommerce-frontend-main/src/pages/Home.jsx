import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryBar from '../components/CategoryBar';
import FilterBar from '../components/FilterBar';
import ProductGrid from '../components/ProductGrid';
import styles from './Home.module.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllProducts,
  getFilterProducts,
  searchProducts,
} from '../feature/product/productThunk';
import { getAllCategories } from '../feature/category/categoryThunk';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ minPrice: '', maxPrice: '' });

  const { products, loading, error } = useSelector((state) => state.product);
  const categories = useSelector((state) => state.category.categories);
  const dispatch = useDispatch();

  // Load categories once on mount.
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Decide which fetch to run whenever the inputs change.
  useEffect(() => {
    if (searchQuery) {
      dispatch(searchProducts(searchQuery));
      return;
    }

    const hasFilter =
      activeCategory !== 'all' || priceRange.minPrice || priceRange.maxPrice;

    if (hasFilter) {
      dispatch(
        getFilterProducts({
          category: activeCategory,
          minPrice: priceRange.minPrice,
          maxPrice: priceRange.maxPrice,
        })
      );
    } else {
      dispatch(getAllProducts());
    }
  }, [searchQuery, activeCategory, priceRange, dispatch]);

  const clearSearch = () => {
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.page}>
      {searchQuery && (
        <div
          style={{
            padding: '12px 16px',
            background: '#f5f5f5',
            borderRadius: 8,
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            Search results for <strong>"{searchQuery}"</strong>
          </span>
          <button
            type="button"
            onClick={clearSearch}
            style={{
              background: 'transparent',
              border: '1px solid #999',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      )}

      {!searchQuery && (
        <div className={styles.toolbar}>
          <CategoryBar
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />
          <FilterBar onApply={setPriceRange} />
        </div>
      )}

      {loading && <p>Loading products…</p>}
      {error && (
        <p style={{ color: '#a00' }}>
          {typeof error === 'string' ? error : error.message || 'Failed to load products.'}
        </p>
      )}
      {!loading && !error && <ProductGrid products={products} />}
    </div>
  );
}
