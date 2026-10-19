import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { spacing } from '../theme';
import { formatPrice } from '../utils/format';
import { sizedImageUrl } from '../utils/imageUrl';
import { renderLog } from '../lib/renderLog';

// The widest card (iPad, 4 columns) is about 250 points wide, so ask the server for that, not for the full 600.
const CARD_IMAGE_WIDTH = 250;

// A neutral grey-beige blur shown while the real photo downloads.
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

function ProductCard({ product, onAdd, onOpen }) {
  const theme = useTheme();
  const outOfStock = !product.inStock;
  renderLog('ProductCard', product.id);

  // What VoiceOver reads for the whole card: the facts a sighted person takes in at a glance.
  const spokenSummary = `${product.name}, ${formatPrice(product.price)}, ${outOfStock ? 'out of stock' : 'in stock'}`;

  return (
    <Card style={[styles.card, outOfStock && styles.outOfStock]}>
      {/* One tappable area for "open this product". The Add button sits outside it,
          so VoiceOver can reach it as its own control instead of it being swallowed by the card. */}
      <Pressable
        onPress={() => onOpen(product.id)}
        accessibilityRole="button"
        accessibilityLabel={spokenSummary}
        accessibilityHint="Opens the product details"
      >
        <Image
          source={{ uri: sizedImageUrl(product.imageUrl, CARD_IMAGE_WIDTH) }}
          style={styles.cover}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          placeholder={{ blurhash: BLURHASH }}
          accessible={false}
        />
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" numberOfLines={1} maxFontSizeMultiplier={1.4}>
            {product.name}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }} maxFontSizeMultiplier={1.4}>
            {product.category}
          </Text>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.primary }}
            maxFontSizeMultiplier={1.4}
          >
            {formatPrice(product.price)}
          </Text>
          {outOfStock && (
            <Text variant="labelMedium" style={{ color: theme.colors.error }} maxFontSizeMultiplier={1.4}>
              Out of stock
            </Text>
          )}
        </Card.Content>
      </Pressable>
      <Card.Actions>
        <Button
          mode="contained-tonal"
          compact
          disabled={outOfStock}
          onPress={() => onAdd(product)}
          accessibilityLabel={`Add ${product.name} to cart`}
        >
          Add
        </Button>
      </Card.Actions>
    </Card>
  );
}

export default memo(ProductCard);

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