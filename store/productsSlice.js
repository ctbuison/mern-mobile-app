import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from '../services/products';
import { ensureOnline } from '../lib/network';
import { getErrorMessage } from '../lib/errors';
import { sessionEnded } from './sessionActions';

// A thunk is a function Redux can run for us. createAsyncThunk wraps it and automatically
// dispatches three actions: products/load/pending, then fulfilled or rejected.
async function fetchWhenOnline(_arg, { rejectWithValue }) {
  try {
    await ensureOnline();
    return await fetchProducts(); // becomes action.payload of the "fulfilled" action
  } catch (err) {
    return rejectWithValue(getErrorMessage(err)); // becomes action.payload of the "rejected" action
  }
}

// First load (or "Try again"): the screen shows its loading state.
export const loadProducts = createAsyncThunk('products/load', fetchWhenOnline, {
  // If a load is already running, do not start a second one. No actions are dispatched.
  condition: (_arg, { getState }) => getState().products.status !== 'loading',
});

// Pull-to-refresh and reconnect: the list stays on screen while this runs.
export const refreshProducts = createAsyncThunk('products/refresh', fetchWhenOnline);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  error: '',
  refreshing: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'success';
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? action.error.message;
      })
      .addCase(refreshProducts.pending, (state) => {
        state.refreshing = true;
      })
      .addCase(refreshProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'success';
        state.refreshing = false;
      })
      .addCase(refreshProducts.rejected, (state) => {
        state.refreshing = false;
      })
      .addCase(sessionEnded, () => initialState);
  },
});

export default productsSlice.reducer;

export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsRefreshing = (state) => state.products.refreshing;