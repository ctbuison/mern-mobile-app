import { createSlice } from '@reduxjs/toolkit';
import { sessionEnded } from './sessionActions';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // addItem(product) or addItem(product, 3). The "prepare" step lets callers pass two plain arguments.
    addItem: {
      reducer(state, action) {
        const { product, quantity } = action.payload;
        const existing = state.items.find((item) => item.product.id === product.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          state.items.push({ product, quantity });
        }
      },
      prepare(product, quantity = 1) {
        return { payload: { product, quantity } };
      },
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
  // Actions that belong to another part of the app, but this slice must react to.
  extraReducers: (builder) => {
    builder.addCase(sessionEnded, () => initialState);
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors: small functions that read one answer out of the whole state.
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);