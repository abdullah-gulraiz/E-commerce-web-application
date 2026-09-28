import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';
import productReducer from '../feature/product/productSlics';
import categoryReducer from '../feature/category/categorySlice';
import cartReducer from '../feature/cart/cartSlice';
import orderReducer from '../feature/order/orderSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;