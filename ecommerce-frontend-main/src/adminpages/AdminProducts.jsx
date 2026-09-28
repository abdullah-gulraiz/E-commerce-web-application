import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllProducts,
  deleteProduct,
} from '../feature/product/productThunk';
import { getAllCategories } from '../feature/category/categoryThunk';
import styles from './AdminProducts.module.css';

export default function AdminProducts() {
  const { products = [], loading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const result = await dispatch(deleteProduct(id));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getAllProducts());
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Products</h1>
        <Link to="/adminlayout/products/new" className={styles.addBtn}>
          Add product
        </Link>
      </div>

      {loading && <p>Loading products…</p>}
      {error && (
        <p style={{ color: '#a00' }}>
          {typeof error === 'string' ? error : error.message || 'Failed to load.'}
        </p>
      )}

      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 24 }}>
                  No products yet. Add one to get started.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>{product.category?.name || '—'}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/adminlayout/products/${product._id}/edit`}
                      className={styles.editLink}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.title)}
                      type="button"
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
