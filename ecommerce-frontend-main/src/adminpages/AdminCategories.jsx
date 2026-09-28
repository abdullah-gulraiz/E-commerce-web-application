import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllCategories,
  deleteCategory,
} from '../feature/category/categoryThunk';
import styles from './AdminCategories.module.css';

export default function AdminCategories() {
  const { categories = [], loading, error } = useSelector(
    (state) => state.category
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    const result = await dispatch(deleteCategory(id));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(getAllCategories());
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.heading}>Categories</h1>
        <Link to="/adminlayout/categories/new" className={styles.addBtn}>
          Add category
        </Link>
      </div>

      {loading && <p>Loading categories…</p>}
      {error && (
        <p style={{ color: '#a00' }}>
          {typeof error === 'string' ? error : error.message || 'Failed to load.'}
        </p>
      )}

      {!loading && !error && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: 'center', padding: 24 }}>
                  No categories yet. Add one to organize your products.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td className={styles.actionsCell}>
                    <Link
                      to={`/adminlayout/categories/${category._id}/edit`}
                      className={styles.editLink}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
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
