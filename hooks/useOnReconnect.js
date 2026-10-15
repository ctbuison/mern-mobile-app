import { useEffect, useRef } from 'react';
import useIsOffline from './useIsOffline';

// Runs `callback` once each time the connection comes back after having been lost.
export default function useOnReconnect(callback) {
  const offline = useIsOffline();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (offline) {
      wasOffline.current = true;
    } else if (wasOffline.current) {
      wasOffline.current = false;
      callback();
    }
  }, [offline, callback]);
}