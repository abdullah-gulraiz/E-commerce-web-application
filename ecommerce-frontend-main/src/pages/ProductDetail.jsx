import { useState, useEffect } from 'react';
import ProductGallery from '../components/ProductGallery';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import styles from './ProductDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../feature/product/productThunk';
import { addToCart } from '../feature/cart/cartThunk';

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails, loading, error } = useSelector((state) => state.product);

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [id, dispatch]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const result = await dispatch(addToCart({ productId: id, quantity }));
    setAddingToCart(false);
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/layout/cart');
    }
  };

  if (loading && !productDetails) return <div className={styles.page}>Loading…</div>;
  if (error && !productDetails) {
    return (
      <div className={styles.page}>
        <p style={{ color: '#a00' }}>
          {typeof error === 'string' ? error : error.message || 'Failed to load product.'}
        </p>
      </div>
    );
  }
  if (!productDetails) return <div className={styles.page}>Product not found.</div>;

  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <ProductGallery
          images={productDetails.image || []}
          title={productDetails.title}
        />

        <div className={styles.info}>
          <span className={styles.category}>
            {productDetails.category?.name || ''}
          </span>
          <h1 className={styles.title}>{productDetails.title}</h1>
          <p className={styles.price}>${productDetails.price?.toFixed(2)}</p>
          <p className={styles.description}>{productDetails.description}</p>

          <div className={styles.quantityRow}>
            <span className={styles.quantityLabel}>Quantity</span>
            <div className={styles.stepper}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={styles.addToCartBtn}
            disabled={addingToCart}
          >
            {addingToCart ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <h2 className={styles.reviewsHeading}>Reviews</h2>
        <ReviewList reviews={productDetails.reviews || []} />
        <ReviewForm id={id} />
      </div>
    </div>
  );
}
