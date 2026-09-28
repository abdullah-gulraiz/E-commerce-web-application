import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient';

const errorPayload = (error) => error.response?.data || { message: error.message };

export const addCategory = createAsyncThunk('category/addCategory', async (categoryData, { rejectWithValue }) => {
  try {
    const response = await api.post('/categories/', categoryData);
    return response.data;
  } catch (error) {
    return rejectWithValue(errorPayload(error));
  }
});

export const updateCategory = createAsyncThunk('category/updateCategory', async ({ id, categoryData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    return rejectWithValue(errorPayload(error));
  }
});

export const deleteCategory = createAsyncThunk('category/deleteCategory', async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(errorPayload(error));
  }
});

export const getAllCategories = createAsyncThunk('category/getAllCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/categories/');
    return response.data;
  } catch (error) {
    return rejectWithValue(errorPayload(error));
  }
});
