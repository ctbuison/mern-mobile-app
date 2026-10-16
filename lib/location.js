import * as Location from 'expo-location';

// Makes sure we may read the location while the app is open.
// Returns the permission answer: { granted, canAskAgain, status }.
// iOS shows the system prompt only the first time. After a denial, canAskAgain is false.
export async function ensureLocationPermission() {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.granted || !current.canAskAgain) {
    return current;
  }
  return Location.requestForegroundPermissionsAsync();
}

// One reading, trimmed to the fields the app uses.
export async function getCurrentCoords() {
  const { coords, timestamp } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy: coords.accuracy,
    timestamp,
  };
}