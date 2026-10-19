import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import cartReducer from '../store/cartSlice';

// A fresh store for every test, so one test can never leak cart items into the next.
export function makeTestStore(preloadedState) {
  return configureStore({
    reducer: { cart: cartReducer },
    preloadedState,
  });
}

export function renderWithStore(ui, { preloadedState, store = makeTestStore(preloadedState) } = {}) {
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}