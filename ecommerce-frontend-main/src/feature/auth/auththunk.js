import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient';

const errorPayload = (error) => error.response?.data || { message: error.message };

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    const { name, email, password, phone, address } = userData;
    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        phone,
        address,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    const { email, password } = userData;
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);
