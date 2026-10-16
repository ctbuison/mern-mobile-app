import { configureStore } from '@reduxjs/toolkit';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import { logger } from './logger';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
  },
  // Keep Redux Toolkit's default middleware and add our logger in development only.
  middleware: (getDefaultMiddleware) => {
    const defaults = getDefaultMiddleware();
    return __DEV__ ? defaults.concat(logger) : defaults;
  },
  // Redux Toolkit's built-in DevTools expect a browser extension. In Expo we use the Expo plugin instead.
  devTools: false,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(devToolsEnhancer()),
});