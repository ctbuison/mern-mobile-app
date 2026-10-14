import { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { products, categories } from './data/products';
import ProductCard from './components/ProductCard';
import FlexPlayground from './components/FlexPlayground';
import { padToFullRows } from './utils/grid';
import { colors, spacing, radius } from './theme';

function EmptyList() {
  return <Text style={styles.empty}>No products match your search.</Text>;
}

function Separator() {
  return <View style={styles.separator} />;
}

const TABS = ['Catalog', 'Flex Playground'];
const NUM_COLUMNS = 2;

export default function App() {
  const [tab, setTab] = useState('Catalog');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesQuery = product.name.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  const gridData = padToFullRows(visibleProducts, NUM_COLUMNS);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />

        <View style={styles.top}>
          <View style={styles.header}>
            <Image source={require('./assets/icon.png')} style={styles.logo} />
            <View>
              <Text style={styles.title}>Shopfront</Text>
              <Text style={styles.subtitle}>Product catalog</Text>
            </View>
          </View>

          <View style={styles.tabs}>
            {TABS.map((name) => (
              <Pressable
                key={name}
                onPress={() => setTab(name)}
                style={[styles.tab, tab === name && styles.tabSelected]}
              >
                <Text style={[styles.tabText, tab === name && styles.tabTextSelected]}>{name}</Text>
              </Pressable>
            ))}
          </View>

          {tab === 'Catalog' && (
            <>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search products"
                placeholderTextColor="#999999"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                clearButtonMode="while-editing"
                style={styles.searchInput}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipScroll}
                contentContainerStyle={styles.chips}
              >
                {categories.map((category) => {
                  const selected = category === selectedCategory;
                  return (
                    <Pressable
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Text style={styles.resultsText}>{visibleProducts.length} products</Text>
            </>
          )}
        </View>

        {tab === 'Catalog' ? (
          <FlatList
            data={gridData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.spacer ? <View style={styles.spacer} /> : <ProductCard product={item} />
            }
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={styles.columnWrapper}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyList}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        ) : (
          <FlexPlayground />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  tabSelected: {
    backgroundColor: colors.text,
  },
  tabText: {
    color: colors.text,
    fontWeight: '600',
  },
  tabTextSelected: {
    color: colors.surface,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 16,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chips: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.primary,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.surface,
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