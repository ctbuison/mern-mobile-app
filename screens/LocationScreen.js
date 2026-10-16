import { useEffect, useRef } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, Card, Text } from 'react-native-paper';
import useLocation from '../hooks/useLocation';
import { colors, spacing } from '../theme';

export default function LocationScreen() {
  const { permission, position, tracking, updates, error, findMe, startTracking, stopTracking } =
    useLocation();
  const denied = permission && !permission.granted;
  const mapRef = useRef(null);

  // Keep the map centred on the latest position, with a short animation.
  useEffect(() => {
    if (position) {
      mapRef.current?.animateToRegion(
        {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  }, [position]);

  return (
    <View style={styles.screen}>
      <View style={styles.row}>
        <Button mode="contained" icon="crosshairs-gps" onPress={findMe}>
          Find me
        </Button>
        <Button
          mode={tracking ? 'contained-tonal' : 'outlined'}
          icon={tracking ? 'stop' : 'navigation-variant-outline'}
          onPress={tracking ? stopTracking : startTracking}
        >
          {tracking ? 'Stop tracking' : 'Track me'}
        </Button>
      </View>

      {denied && (
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium">Location is turned off for Shopfront</Text>
            <Text>
              {permission.canAskAgain
                ? 'Tap Find me again and choose Allow While Using App.'
                : 'You can turn it back on in the Settings app.'}
            </Text>
            {!permission.canAskAgain && (
              <Button mode="outlined" onPress={() => Linking.openSettings()}>
                Open Settings
              </Button>
            )}
          </Card.Content>
        </Card>
      )}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {position && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: position.latitude, longitude: position.longitude }}
            title="You are here"
          />
        </MapView>
      )}

      {position && (
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium">You are here</Text>
            <Text>Latitude: {position.latitude.toFixed(5)}</Text>
            <Text>Longitude: {position.longitude.toFixed(5)}</Text>
            <Text style={styles.muted}>Accurate to about {Math.round(position.accuracy)} m</Text>
            {tracking && <Text style={styles.muted}>Updates received: {updates}</Text>}
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  map: {
    flex: 1,
    borderRadius: 12,
  },
  card: {
    backgroundColor: colors.surface,
  },
  cardContent: {
    gap: spacing.sm,
  },
  muted: {
    color: colors.muted,
  },
  error: {
    color: colors.danger,
  },
});