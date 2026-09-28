import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiClient';

const errorPayload = (error) => error.response?.data || { message: error.message };

// The client only sends the shipping address; the backend builds the order
// from the server-side cart. See backend/controller/orderController.js.
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders/place', {
        shippingAddress: orderData.shippingAddress,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

// Admin — every order in the system
export const getAllOrders = createAsyncThunk(
  'order/getAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/');
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

// User — the caller's own orders
export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);
