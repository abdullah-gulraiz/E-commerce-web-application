import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, updateCategory } from '../feature/category/categoryThunk';
import styles from './AdminCategoryForm.module.css';

export default function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
  });

  // Pull the category from the already-loaded list in Redux
  const existingCategory = useSelector((state) =>
    state.category.categories.find((c) => c._id === id)
  );

  // Pre-fill the form once we have the existing category's data
  useEffect(() => {
    if (isEditMode && existingCategory) {
      setFormData({ name: existingCategory.name });
    }
  }, [isEditMode, existingCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      await dispatch(updateCategory({ id, categoryData: formData }));
    } else {
      await dispatch(addCategory(formData));
    }

    navigate('/adminlayout/categories');
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{isEditMode ? 'Edit category' : 'Add category'}</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="e.g. Kitchen"
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/adminlayout/categories')}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn}>
            {isEditMode ? 'Save changes' : 'Add category'}
          </button>
        </div>
      </form>
    </div>
  );
}