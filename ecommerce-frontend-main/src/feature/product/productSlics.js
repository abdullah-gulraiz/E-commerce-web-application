import { createSlice } from '@reduxjs/toolkit';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  addReview,
  getFilterProducts,
  searchProducts,
  productPagination,
} from './productThunk';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
    productDetails: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  },
  reducers: {},
  extraReducers: (builder) => {
    const startLoading = (state) => {
      state.loading = true;
      state.error = null;
    };
    const setError = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Something went wrong';
    };

    builder
      // Add
      .addCase(addProduct.pending, startLoading)
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, setError)

      // Update
      .addCase(updateProduct.pending, startLoading)
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, setError)

      // Delete
      .addCase(deleteProduct.pending, startLoading)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p._id !== action.payload._id
        );
      })
      .addCase(deleteProduct.rejected, setError)

      // Get all
      .addCase(getAllProducts.pending, startLoading)
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, setError)

      // Get by id
      .addCase(getProductById.pending, startLoading)
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(getProductById.rejected, setError)

      // Add review — response is the updated product
      .addCase(addReview.pending, startLoading)
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(addReview.rejected, setError)

      // Filter
      .addCase(getFilterProducts.pending, startLoading)
      .addCase(getFilterProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getFilterProducts.rejected, setError)

      // Search
      .addCase(searchProducts.pending, startLoading)
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, setError)

      // Pagination — now returns { products, page, limit, total, totalPages }
      .addCase(productPagination.pending, startLoading)
      .addCase(productPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(productPagination.rejected, setError);
  },
});

export default productSlice.reducer;
