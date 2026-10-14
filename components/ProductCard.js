import { View, Text, Image, Platform, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product }) {
  const outOfStock = !product.inStock;

  return (
    <View style={[styles.shadow, outOfStock && styles.outOfStock]}>
      <View style={styles.clip}>
        <View>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
          {outOfStock && <Text style={styles.badge}>Out of stock</Text>}
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={[styles.price, outOfStock && styles.priceMuted]}>
            {formatPrice(product.price)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  android: {
    elevation: 3,
  },
  default: {},
});

const styles = StyleSheet.create({
  shadow: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...cardShadow,
  },
  clip: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  outOfStock: {
    opacity: 0.6,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.danger,
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    padding: spacing.md,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  category: {
    color: colors.muted,
  },
  price: {
    marginTop: spacing.xs,
    fontWeight: '700',
    color: colors.success,
  },
  priceMuted: {
    color: colors.muted,
  },
});