import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';
import useIsOffline from '../hooks/useIsOffline';
import { colors, spacing } from '../theme';

// A thin strip that appears only while the device has no connection.
export default function OfflineBanner() {
  const offline = useIsOffline();

  if (!offline) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <MaterialCommunityIcons name="wifi-off" size={18} color={colors.surface} />
      <Text style={styles.text}>You are offline. Some things may not work.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.text,
  },
  text: {
    color: colors.surface,
  },
});