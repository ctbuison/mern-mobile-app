import { useState } from 'react';
import { View, Text, FlatList, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { Appbar, Searchbar, Chip, Snackbar } from 'react-native-paper';
import ProductCard from '../components/ProductCard';
import ErrorState from '../components/ErrorState';
import OfflineBanner from '../components/OfflineBanner';
import ProductListSkeleton from '../components/ProductListSkeleton';
import DeviceInfo from '../components/DeviceInfo';
import { useCart } from '../context/CartContext';
import useProducts from '../hooks/useProducts';
import useScreenLog from '../hooks/useScreenLog';
import { padToFullRows } from '../utils/grid';
import useBreakpoint from '../hooks/useBreakpoint';
import { colors, spacing } from '../theme';

function EmptyList() {
  return <Text style={styles.empty}>No products match your search.</Text>;
}

function Separator() {
  return <View style={styles.separator} />;
}

export default function ProductListScreen({ navigation }) {
  useScreenLog();
  const { addItem } = useCart();
  const { numColumns } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [message, setMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const { products, status, error, refreshing, reload, refresh } = useProducts();

  const categories = ['All', ...new Set(products.map((product) => product.category))];

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesQuery = product.name.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  const gridData = padToFullRows(visibleProducts, numColumns);

  // What the list shows when it has no rows: a spinner, an error with a retry, or "no matches".
  let emptyComponent = <EmptyList />;
  if (status === 'loading') {
    emptyComponent = <ProductListSkeleton numColumns={numColumns} />;
  } else if (status === 'error') {
    emptyComponent = <ErrorState message={error} onRetry={reload} />;
  }

  const handleRefresh = async () => {
    const worked = await refresh();
    if (!worked) {
      setMessage('Could not refresh. Showing the products from earlier.');
    }
  };

  const toggleMenu = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const handleAdd = (product) => {
    addItem(product);
    setMessage(`${product.name} added to cart`);
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.Action icon="menu" accessibilityLabel="Open menu" onPress={toggleMenu} />
        <Appbar.Content title="Shopfront" />
        <Appbar.Action
          icon="information-outline"
          accessibilityLabel="Device info"
          onPress={() => setShowInfo((value) => !value)}
        />
      </Appbar.Header>

      <OfflineBanner />

      <SafeAreaView style={styles.body} edges={['left', 'right']}>
        <View style={styles.content}>
          <View style={styles.top}>
            {showInfo && <DeviceInfo />}

            <Searchbar
              value={query}
              onChangeText={setQuery}
              placeholder="Search products"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.searchbar}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
              contentContainerStyle={styles.chips}
            >
              {categories.map((category) => (
                <Chip
                  key={category}
                  selected={category === selectedCategory}
                  onPress={() => setSelectedCategory(category)}
                >
                  {category}
                </Chip>
              ))}
            </ScrollView>

            {status === 'success' && (
              <Text style={styles.resultsText}>{visibleProducts.length} products</Text>
            )}
          </View>

          <FlatList
            key={numColumns}
            data={gridData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.spacer ? (
                <View style={styles.spacer} />
              ) : (
                <ProductCard product={item} onAdd={handleAdd} />
              )
            }
            numColumns={numColumns}
            columnWrapperStyle={styles.columnWrapper}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={emptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + spacing.xl },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        </View>
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
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
  },
  top: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  searchbar: {
    backgroundColor: colors.surface,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chips: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  resultsText: {
    color: colors.muted,
    paddingBottom: spacing.sm,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  spacer: {
    flex: 1,
  },
  separator: {
    height: spacing.md,
  },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 32,
  },
});