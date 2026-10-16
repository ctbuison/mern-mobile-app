import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { logger } from './logger';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  // Keep Redux Toolkit's default middleware and add our logger in development only.
  middleware: (getDefaultMiddleware) => {
    const defaults = getDefaultMiddleware();
    return __DEV__ ? defaults.concat(logger) : defaults;
  },
});