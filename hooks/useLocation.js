import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { ensureLocationPermission, getCurrentCoords } from '../lib/location';

// Reads the device location, once or continuously.
// permission: null until we have asked, then { granted, canAskAgain }
// position:   the latest { latitude, longitude, accuracy, timestamp }, or null
export default function useLocation() {
  const [permission, setPermission] = useState(null);
  const [position, setPosition] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [updates, setUpdates] = useState(0);
  const [error, setError] = useState('');
  const subscription = useRef(null);
  const mounted = useRef(true);

  // Stop listening when the screen goes away. Forgetting this keeps the GPS running.
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      subscription.current?.remove();
      subscription.current = null;
    };
  }, []);

  const findMe = useCallback(async () => {
    setError('');
    const answer = await ensureLocationPermission();
    setPermission(answer);
    if (!answer.granted) {
      return;
    }
    try {
      setPosition(await getCurrentCoords());
    } catch (err) {
      setError('Could not read your location. Check that Location Services is turned on.');
    }
  }, []);

  const startTracking = useCallback(async () => {
    setError('');
    const answer = await ensureLocationPermission();
    setPermission(answer);
    if (!answer.granted || subscription.current) {
      return;
    }
    try {
      const watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10 },
        ({ coords, timestamp }) => {
          setPosition({
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            timestamp,
          });
          setUpdates((count) => count + 1);
        }
      );
      if (!mounted.current) {
        watcher.remove();
        return;
      }
      subscription.current = watcher;
      setTracking(true);
    } catch (err) {
      setError('Could not follow your location. Check that Location Services is turned on.');
    }
  }, []);

  const stopTracking = useCallback(() => {
    subscription.current?.remove();
    subscription.current = null;
    setTracking(false);
  }, []);

  return { permission, position, tracking, updates, error, findMe, startTracking, stopTracking };
}