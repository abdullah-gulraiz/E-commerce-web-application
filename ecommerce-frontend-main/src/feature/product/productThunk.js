import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient';

const errorPayload = (error) => error.response?.data || { message: error.message };

// Admin — create a product. `productData` is a FormData object with image files.
export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/products/add', productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

// Admin — update a product.
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/products/update/${id}`, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

// Admin — delete a product.
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/products/delete/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const getAllProducts = createAsyncThunk(
  'product/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

// User — post a review on a product. Returns the updated product.
export const addReview = createAsyncThunk(
  'product/addReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/products/review/${id}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const getFilterProducts = createAsyncThunk(
  'product/getFilterProducts',
  async (filterParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/filter', { params: filterParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/search', { params: { query } });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const productPagination = createAsyncThunk(
  'product/productPagination',
  async (paginationParams, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/pagination', {
        params: paginationParams,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);
