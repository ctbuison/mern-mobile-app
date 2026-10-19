import { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import CartRow from '../components/CartRow';
import { removeItem, selectCartItems, selectCartTotal } from '../store/cartSlice';
import { formatPrice } from '../utils/format';
import { colors, spacing } from '../theme';

function keyExtractor(item) {
  return item.product.id;
}

export default function CartScreen() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const handleRemove = useCallback((productId) => {
    dispatch(removeItem(productId));
  }, [dispatch]);

  const renderItem = useCallback(({ item }) => (
    <CartRow item={item} onRemove={handleRemove} />
  ), [handleRemove]);

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
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
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