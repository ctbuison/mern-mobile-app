import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';

// Logs every time the screen that uses it is shown, with its params.
export default function useScreenLog() {
  const route = useRoute();

  useEffect(() => {
    console.log('[screen]', route.name, route.params ?? {});
  }, [route.name, route.params]);
}