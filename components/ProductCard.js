import { StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { spacing } from '../theme';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product, onAdd }) {
  const theme = useTheme();
  const outOfStock = !product.inStock;

  return (
    <Card style={[styles.card, outOfStock && styles.outOfStock]}>
      <Card.Cover source={{ uri: product.imageUrl }} style={styles.cover} />
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={1}>
          {product.name}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
          {product.category}
        </Text>
        <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
          {formatPrice(product.price)}
        </Text>
        {outOfStock && (
          <Text variant="labelMedium" style={{ color: theme.colors.error }}>
            Out of stock
          </Text>
        )}
      </Card.Content>
      <Card.Actions>
        <Button mode="contained-tonal" compact disabled={outOfStock} onPress={() => onAdd(product)}>
          Add
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  outOfStock: {
    opacity: 0.6,
  },
  cover: {
    height: 140,
  },
  content: {
    paddingTop: spacing.md,
    gap: 2,
  },
});