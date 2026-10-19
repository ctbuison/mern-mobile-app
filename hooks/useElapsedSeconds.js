import { useEffect, useState } from 'react';

// Counts up once a second while a screen is open ("You have been looking at this for 12s").
export default function useElapsedSeconds() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log('[elapsed] tick');
      setSeconds((value) => value + 1);
    }, 1000);

    // Cleanup: runs when the screen unmounts. Without it the timer keeps ticking forever.
    return () => clearInterval(id);
  }, []);

  return seconds;
}