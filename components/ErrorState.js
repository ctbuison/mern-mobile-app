import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, Text } from 'react-native-paper';
import { colors, spacing } from '../theme';

// A calm, full-area message with a way forward. Used wherever a screen cannot show its data.
export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <MaterialCommunityIcons name="alert-circle-outline" size={56} color={colors.danger} />
      <Text variant="titleMedium">{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button mode="contained" icon="refresh" onPress={onRetry}>
          Try again
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  message: {
    color: colors.muted,
    textAlign: 'center',
  },
});