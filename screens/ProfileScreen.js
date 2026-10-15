import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing } from '../theme';

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text variant="titleMedium">Profile</Text>
      <Text style={styles.hint}>Account details will appear here after Module 7.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  hint: {
    color: colors.muted,
    textAlign: 'center',
  },
});