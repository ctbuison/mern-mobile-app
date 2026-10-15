import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { colors, spacing } from '../theme';

export default function SplashScreen() {
  return (
    <View style={styles.screen}>
      <Text variant="headlineMedium" style={styles.brand}>
        Shopfront
      </Text>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  brand: {
    color: colors.primary,
    fontWeight: '700',
  },
});