import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { spacing } from '../theme';
import { formatPrice } from '../utils/format';
import { sizedImageUrl } from '../utils/imageUrl';

// The widest card (iPad, 4 columns) is about 250 points wide, so ask the server for that, not for the full 600.
const CARD_IMAGE_WIDTH = 250;

// A neutral grey-beige blur shown while the real photo downloads.
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export default function ProductCard({ product, onAdd }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const outOfStock = !product.inStock;

  return (
    <Card
      style={[styles.card, outOfStock && styles.outOfStock]}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
    >
      <Image
        source={{ uri: sizedImageUrl(product.imageUrl, CARD_IMAGE_WIDTH) }}
        style={styles.cover}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        placeholder={{ blurhash: BLURHASH }}
        accessibilityLabel={`${product.name} photo`}
      />
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