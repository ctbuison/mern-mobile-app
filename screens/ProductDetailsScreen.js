import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Button, Card, IconButton, Snackbar, Text } from 'react-native-paper';
import { BREAKPOINTS } from '../hooks/useBreakpoint';
import { colors, spacing } from '../theme';
import { formatPrice } from '../utils/format';

export default function ProductDetailsScreen({ product, onBack }) {
  const { width } = useWindowDimensions();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const outOfStock = !product.inStock;
  const wideLayout = width >= BREAKPOINTS.tablet;

  const addToCart = () => {
    setMessage(`${quantity} ${product.name} added to cart`);
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title={product.name} />
      </Appbar.Header>

      <SafeAreaView style={styles.body} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.content, wideLayout && styles.wideContent]}>
            <Card style={[styles.imageCard, wideLayout && styles.wideImageCard]}>
              <Image
                source={{ uri: product.imageUrl }}
                style={[styles.image, wideLayout && styles.wideImage]}
                resizeMode="cover"
                accessibilityLabel={product.name}
              />
            </Card>

            <View style={styles.details}>
              <Text variant="titleLarge">{product.name}</Text>
              <Text variant="bodyMedium" style={styles.category}>
                {product.category}
              </Text>
              <Text variant="headlineSmall" style={styles.price}>
                {formatPrice(product.price)}
              </Text>
              <Text
                variant="labelLarge"
                style={[styles.stock, outOfStock && styles.outOfStock]}
              >
                {outOfStock ? 'Out of stock' : 'In stock'}
              </Text>
              <Text variant="bodyLarge" style={styles.description}>
                {product.description}
              </Text>

              <Text variant="titleMedium">Quantity</Text>
              <View style={styles.quantity}>
                <IconButton
                  icon="minus"
                  mode="outlined"
                  accessibilityLabel="Decrease quantity"
                  disabled={outOfStock || quantity <= 1}
                  onPress={() => setQuantity((current) => Math.max(1, current - 1))}
                />
                <Text variant="titleMedium" accessibilityLabel={`Quantity ${quantity}`}>
                  {quantity}
                </Text>
                <IconButton
                  icon="plus"
                  mode="outlined"
                  accessibilityLabel="Increase quantity"
                  disabled={outOfStock || quantity >= 10}
                  onPress={() => setQuantity((current) => Math.min(10, current + 1))}
                />
              </View>

              <Button mode="contained" disabled={outOfStock} onPress={addToCart}>
                Add to cart
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Snackbar visible={message !== ''} onDismiss={() => setMessage('')} duration={2000}>
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: spacing.lg,
  },
  wideContent: {
    maxWidth: 1000,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageCard: {
    overflow: 'hidden',
  },
  wideImageCard: {
    flex: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1.5,
  },
  wideImage: {
    aspectRatio: 0.9,
  },
  details: {
    flex: 1,
    gap: spacing.md,
  },
  category: {
    color: colors.muted,
  },
  price: {
    color: colors.primary,
  },
  stock: {
    color: colors.success,
  },
  outOfStock: {
    color: colors.danger,
  },
  description: {
    lineHeight: 24,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
