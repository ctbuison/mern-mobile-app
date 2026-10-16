import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadProducts,
  refreshProducts,
  selectProducts,
  selectProductsError,
  selectProductsRefreshing,
  selectProductsStatus,
  selectProductsUpdatedAt,
} from '../store/productsSlice';
import useOnReconnect from './useOnReconnect';

// Same return shape as before, but the data now lives in the Redux store, shared by every screen.
export default function useProducts() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const storeStatus = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const refreshing = useSelector(selectProductsRefreshing);
  const lastUpdated = useSelector(selectProductsUpdatedAt);

  // Before the first request starts the store says 'idle'. To the screen that is still "loading".
  const status = storeStatus === 'idle' ? 'loading' : storeStatus;

  const reload = useCallback(() => dispatch(loadProducts()), [dispatch]);

  // Pull-to-refresh: .unwrap() turns a rejected thunk into a thrown error, so we can report true/false.
  const refresh = useCallback(async () => {
    try {
      await dispatch(refreshProducts()).unwrap();
      return true;
    } catch (err) {
      return false;
    }
  }, [dispatch]);

  useEffect(() => {
    reload();
  }, [reload]);

  // When the connection comes back, quietly fetch fresh data.
  useOnReconnect(refresh);

  return { products, status, error, refreshing, lastUpdated, reload, refresh };
}