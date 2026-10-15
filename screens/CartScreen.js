import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing } from '../theme';

export default function CartScreen() {
  return (
    <View style={styles.screen}>
      <Text variant="titleMedium">Your cart is empty</Text>
      <Text style={styles.hint}>Add something from the Shop tab.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  hint: {
    color: colors.muted,
  },
});