import { useCallback, useEffect, useState } from 'react';
import { fetchProduct } from '../services/products';
import { getErrorMessage } from '../lib/errors';
import { ensureOnline } from '../lib/network';
import useOnReconnect from './useOnReconnect';

// Loads one product by id and reports which state it is in: 'loading', 'success' or 'error'.
export default function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    ensureOnline()
      .then(() => fetchProduct(productId))
      .then((result) => {
        if (cancelled) return;
        setProduct(result);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err));
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [productId, attempt]);

  // Changing `attempt` re-runs the effect above, which is all a retry needs to be.
  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  // If the product failed to load while offline, try again when the connection returns.
  const retryIfFailed = useCallback(() => {
    if (status === 'error') reload();
  }, [status, reload]);
  useOnReconnect(retryIfFailed);

  return { product, status, error, reload };
}