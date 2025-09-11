import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import AuthReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    auth: AuthReducer,
  },
});

export default store;
