import { useState, useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import useScreenLog from '../hooks/useScreenLog';
import { Text, Button, Card, Chip, IconButton, Snackbar } from 'react-native-paper';
import { BREAKPOINTS } from '../hooks/useBreakpoint';
import { colors, radius, spacing } from '../theme';
import { formatPrice } from '../utils/format';

export default function ProductDetailScreen({ route, navigation }) {
  useScreenLog();
  const { addItem } = useCart();
  const { productId } = route.params;
  const index = products.findIndex((item) => item.id === productId);
  const product = products[index];
  const nextProduct = products[(index + 1) % products.length];
  const { width } = useWindowDimensions();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [favorite, setFavorite] = useState(false);
  /*
  useEffect(() => {
    console.log('stack:', navigation.getState().routes.map((item) => item.name).join(' > '), '| product', productId);
  }, [productId]);
  */
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
      <View style={styles.notFound}>
        <Text variant="titleMedium">Product not found</Text>
      </View>
    );
  }

  const outOfStock = !product.inStock;
  const wideLayout = width >= BREAKPOINTS.tablet;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setMessage(`${quantity} x ${product.name} added to cart`);
  };

  return (
    <View style={styles.screen}>

      <SafeAreaView style={styles.body} edges={['left', 'right']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.content, wideLayout && styles.wideContent]}>
            <Card style={[styles.imageCard, wideLayout && styles.wideImageCard]}>
              <View style={styles.imageClip}>
                <Image
                  source={{ uri: product.imageUrl }}
                  style={[styles.image, wideLayout && styles.wideImage]}
                  resizeMode="cover"
                  accessibilityLabel={product.name}
                />
              </View>
            </Card>

            <View style={styles.details}>
              <Text variant="titleLarge">{product.name}</Text>
              <Text variant="headlineSmall" style={styles.price}>
                {formatPrice(product.price)}
              </Text>
              <View style={styles.chips}>
                <Chip icon="tag-outline">
                  {product.category}
                </Chip>
                <Chip icon={outOfStock ? 'close' : 'check'}>
                  {outOfStock ? 'Out of stock' : 'In stock'}
                </Chip>
                  
              </View>
              
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
              <Button mode="contained" disabled={outOfStock} onPress={handleAddToCart}>
                Add to cart
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.push('ProductDetail', { productId: nextProduct.id })}
              >
                See next product
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: radius.md,
  },
  imageClip: {
    overflow: 'hidden',
    borderRadius: radius.md,
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
