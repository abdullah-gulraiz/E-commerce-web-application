import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient';

const errorPayload = (error) => error.response?.data || { message: error.message };

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload, { rejectWithValue }) => {
    // Accept either just an id string or a { productId, quantity } object.
    const body =
      typeof payload === 'string'
        ? { productId: payload, quantity: 1 }
        : { productId: payload.productId, quantity: payload.quantity ?? 1 };
    try {
      const response = await api.post('/cart/add', body);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const getallCartItems = createAsyncThunk(
  'cart/getallCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart/');
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put('/cart/update', { productId, quantity });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete('/cart/remove', { data: { productId } });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);
