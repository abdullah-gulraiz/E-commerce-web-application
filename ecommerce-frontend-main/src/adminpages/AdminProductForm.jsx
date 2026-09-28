import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProduct,
  updateProduct,
  getProductById,
  getAllProducts,
} from '../feature/product/productThunk';
import { getAllCategories } from '../feature/category/categoryThunk';
import styles from './AdminProductForm.module.css';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const categories = useSelector((state) => state.category.categories);
  const existingProduct = useSelector((state) =>
    state.product.products.find((p) => p._id === id)
  );
  const { loading } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null, // FileList
  });
  const [formError, setFormError] = useState(null);

  // Make sure we have categories to populate the dropdown.
  useEffect(() => {
    dispatch(getAllCategories());
    if (isEditMode && !existingProduct) {
      // If the user opened the edit URL directly (no list preloaded), fetch it.
      dispatch(getProductById(id));
      dispatch(getAllProducts());
    }
  }, [dispatch, isEditMode, id, existingProduct]);

  useEffect(() => {
    if (isEditMode && existingProduct) {
      setFormData((prev) => ({
        ...prev,
        title: existingProduct.title || '',
        description: existingProduct.description || '',
        price: existingProduct.price ?? '',
        category:
          existingProduct.category?._id || existingProduct.category || '',
      }));
    }
  }, [isEditMode, existingProduct]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormError(null);
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      formData.price === '' ||
      !formData.category
    ) {
      setFormError('Title, description, price and category are required.');
      return;
    }
    if (Number(formData.price) < 0) {
      setFormError('Price cannot be negative.');
      return;
    }
    // On CREATE we require at least one image. On EDIT it's optional
    // (keeping the existing images unchanged).
    if (!isEditMode && (!formData.image || formData.image.length === 0)) {
      setFormError('Please attach at least one product image.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('description', formData.description.trim());
    data.append('price', formData.price);
    data.append('category', formData.category);

    if (formData.image && formData.image.length > 0) {
      for (let i = 0; i < formData.image.length; i++) {
        data.append('image', formData.image[i]);
      }
    }

    const action = isEditMode
      ? updateProduct({ id, productData: data })
      : addProduct(data);
    const result = await dispatch(action);

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/adminlayout/products');
    } else {
      setFormError(
        result.payload?.message || 'Failed to save product. Please try again.'
      );
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        {isEditMode ? 'Edit product' : 'Add product'}
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
            placeholder="Ceramic pour-over set"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the product"
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="image">
            Product images
            {isEditMode && (
              <span className={styles.optional}>
                {' '}(leave empty to keep current images)
              </span>
            )}
          </label>
          <input
            id="image"
            name="image"
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {formError && (
          <div
            role="alert"
            style={{
              padding: '10px 12px',
              background: '#fee',
              color: '#a00',
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {formError}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/adminlayout/products')}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? 'Saving…' : isEditMode ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </div>
  );
}
