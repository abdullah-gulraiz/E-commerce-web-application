import { createSlice } from '@reduxjs/toolkit';
import {
  addToCart,
  getallCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from './cartThunk';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Every cart endpoint returns the full populated cart, so all fulfilled
    // handlers do the same thing: overwrite state.items from the response.
    const setItems = (state, action) => {
      state.loading = false;
      state.items = action.payload?.items || [];
    };
    const setLoading = (state) => {
      state.loading = true;
      state.error = null;
    };
    const setError = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Cart error';
    };

    builder
      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, setItems)
      .addCase(addToCart.rejected, setError)
      .addCase(getallCartItems.pending, setLoading)
      .addCase(getallCartItems.fulfilled, setItems)
      .addCase(getallCartItems.rejected, setError)
      .addCase(updateCartItemQuantity.pending, setLoading)
      .addCase(updateCartItemQuantity.fulfilled, setItems)
      .addCase(updateCartItemQuantity.rejected, setError)
      .addCase(removeCartItem.pending, setLoading)
      .addCase(removeCartItem.fulfilled, setItems)
      .addCase(removeCartItem.rejected, setError);
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
