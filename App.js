import { useState } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaperProvider, Appbar, Searchbar, Chip, Snackbar } from 'react-native-paper';
import { products, categories } from './data/products';
import ProductCard from './components/ProductCard';
import { padToFullRows } from './utils/grid';
import useBreakpoint from './hooks/useBreakpoint';
import { colors, spacing, paperTheme } from './theme';

function EmptyList() {
  return <Text style={styles.empty}>No products match your search.</Text>;
}

function Separator() {
  return <View style={styles.separator} />;
}

function Catalog() {
  const { numColumns } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [message, setMessage] = useState('');

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesQuery = product.name.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  const gridData = padToFullRows(visibleProducts, numColumns);

  const handleAdd = (product) => {
    setMessage(`${product.name} added to cart`);
  };

  return (
    <View style={styles.screen}>
      <Appbar.Header>
        <Appbar.Content title="Shopfront" />
      </Appbar.Header>

      <SafeAreaView style={styles.body} edges={['left', 'right']}>
        <View style={styles.content}>
          <View style={styles.top}>
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

            <Text style={styles.resultsText}>{visibleProducts.length} products</Text>
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
            ListEmptyComponent={EmptyList}
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

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style="dark" />
      <Catalog />
    </PaperProvider>
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