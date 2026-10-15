import { useState, useEffect, useLayoutEffect } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  Chip,
  IconButton,
  Snackbar,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchProduct } from '../services/products';
import { useCart } from '../context/CartContext';
import useScreenLog from '../hooks/useScreenLog';
import useBreakpoint, { BREAKPOINTS } from '../hooks/useBreakpoint';
import { formatPrice } from '../utils/format';
import { colors, spacing } from '../theme';

const MAX_QUANTITY = 10;

export default function ProductDetailScreen({ route, navigation }) {
  useScreenLog();
  const { addItem } = useCart();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useBreakpoint();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchProduct(productId)
      .then((result) => {
        if (!cancelled) setProduct(result);
      })
      .catch((error) => console.log('Could not load product:', error.message));
    return () => {
      cancelled = true;
    };
  }, [productId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: product ? product.name : 'Product',
      headerRight: () => (
        <IconButton
          icon={favorite ? 'heart' : 'heart-outline'}
          accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onPress={() => setFavorite((value) => !value)}
        />
      ),
    });
  }, [navigation, product, favorite]);

  if (!product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  const isWide = width >= BREAKPOINTS.tablet;
  const outOfStock = !product.inStock;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setMessage(`${quantity} x ${product.name} added to cart`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <View style={[styles.layout, isWide && styles.layoutWide]}>
          <Image
            source={{ uri: product.imageUrl }}
            style={[styles.image, isWide && styles.imageWide]}
          />

          <View style={styles.details}>
            <Text variant="headlineSmall">{product.name}</Text>
            <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
              {formatPrice(product.price)}
            </Text>

            <View style={styles.chips}>
              <Chip compact>{product.category}</Chip>
              <Chip compact icon={outOfStock ? 'close' : 'check'}>
                {outOfStock ? 'Out of stock' : 'In stock'}
              </Chip>
            </View>

            <Text variant="bodyLarge">{product.description}</Text>

            <View style={styles.quantityRow}>
              <IconButton
                icon="minus"
                mode="contained-tonal"
                accessibilityLabel="Decrease quantity"
                disabled={outOfStock || quantity <= 1}
                onPress={() => setQuantity((value) => value - 1)}
              />
              <Text variant="titleMedium">{quantity}</Text>
              <IconButton
                icon="plus"
                mode="contained-tonal"
                accessibilityLabel="Increase quantity"
                disabled={outOfStock || quantity >= MAX_QUANTITY}
                onPress={() => setQuantity((value) => value + 1)}
              />
            </View>

            <Button mode="contained" disabled={outOfStock} onPress={handleAddToCart}>
              Add to cart
            </Button>
          </View>
        </View>
      </ScrollView>

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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  layout: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    gap: spacing.lg,
  },
  layoutWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  imageWide: {
    width: '45%',
  },
  details: {
    flex: 1,
    gap: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});