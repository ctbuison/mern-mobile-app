import { View, FlatList, StyleSheet } from 'react-native';
import { Text, List, IconButton, Divider } from 'react-native-paper';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { colors, spacing } from '../theme';

export default function CartScreen() {
  const { items, total, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text variant="titleMedium">Your cart is empty</Text>
        <Text style={styles.hint}>Add something from the Shop tab.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        ItemSeparatorComponent={Divider}
        renderItem={({ item }) => (
          <List.Item
            title={item.product.name}
            description={`${item.quantity} x ${formatPrice(item.product.price)}`}
            right={() => (
              <IconButton
                icon="delete-outline"
                accessibilityLabel={`Remove ${item.product.name}`}
                onPress={() => removeItem(item.product.id)}
              />
            )}
          />
        )}
      />
      <View style={styles.footer}>
        <Text variant="titleMedium">Total</Text>
        <Text variant="titleMedium">{formatPrice(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
  },
  hint: {
    color: colors.muted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});