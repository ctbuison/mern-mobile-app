import { useCallback, useEffect, useState } from 'react';
import { fetchProducts } from '../services/products';
import { getErrorMessage } from '../lib/errors';
import { ensureOnline } from '../lib/network';
import useOnReconnect from './useOnReconnect';

// Loads the product list and reports which state it is in: 'loading', 'success' or 'error'.
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const reload = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      await ensureOnline();
      setProducts(await fetchProducts());
      setStatus('success');
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus('error');
    }
  }, []);

  // Pull-to-refresh: keep the products on screen and just report whether it worked.
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await ensureOnline();
      setProducts(await fetchProducts());
      setStatus('success');
      return true;
    } catch (err) {
      return false;
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // When the connection comes back, quietly fetch fresh data.
  useOnReconnect(refresh);

  return { products, status, error, refreshing, reload, refresh };
}