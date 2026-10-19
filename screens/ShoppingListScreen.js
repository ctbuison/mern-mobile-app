import { useCallback, useState } from 'react';
import { View, FlatList, Linking, RefreshControl, StyleSheet } from 'react-native';
import { Button, Divider, Snackbar, Text, TextInput } from 'react-native-paper';
import ErrorState from '../components/ErrorState';
import ListSkeleton from '../components/ListSkeleton';
import OfflineBanner from '../components/OfflineBanner';
import ShoppingRow from '../components/ShoppingRow';
import useLocationTags from '../hooks/useLocationTags';
import useShoppingList from '../hooks/useShoppingList';
import { colors, spacing } from '../theme';

const keyExtractor = (item) => item.id;

export default function ShoppingListScreen() {
  const { items, status, error, refreshing, reload, refresh, add, toggle, remove } =
    useShoppingList();
  const { tags, tagItem, clearTag } = useLocationTags();
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [needsSettings, setNeedsSettings] = useState(false);

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (trimmed === '') return;

    setAdding(true);
    const result = await add(trimmed);
    setAdding(false);

    if (result.ok) {
      setName('');
    } else {
      setMessage(result.message);
    }
  };

  // Every handler below is wrapped in useCallback so ShoppingRow (which is memo'd) sees the same function each render.
  // The state setters (setMessage, setNeedsSettings) never change identity, so they are safe dependencies.
  const report = useCallback((result) => {
    if (!result.ok) {
      setNeedsSettings(false);
      setMessage(result.message);
    }
  }, []);

  const handleToggle = useCallback(async (item) => report(await toggle(item)), [toggle, report]);
  const handleRemove = useCallback(async (item) => report(await remove(item)), [remove, report]);

  // Tap once to tag the item with where you are now. Tap again to remove the tag.
  // The row tells us whether it already has a tag, so this callback does not depend on `tags`.
  const handleTag = useCallback(
    async (item, hasTag) => {
      if (hasTag) {
        clearTag(item.id);
        return;
      }
      const result = await tagItem(item.id);
      if (!result.ok) {
        setNeedsSettings(result.needsSettings);
        setMessage(result.message);
      }
    },
    [tagItem, clearTag]
  );

  // renderItem reads `tags`, so it gets a new identity only when a tag changes. Rows whose own tag is unchanged still skip.
  const renderItem = useCallback(
    ({ item }) => (
      <ShoppingRow
        item={item}
        tag={tags[item.id]}
        onToggle={handleToggle}
        onTag={handleTag}
        onRemove={handleRemove}
      />
    ),
    [tags, handleToggle, handleTag, handleRemove]
  );

  const handleRefresh = async () => {
    const worked = await refresh();
    if (!worked) setMessage('Could not refresh. Showing your list from earlier.');
  };

  let emptyComponent = (
    <View style={styles.empty}>
      <Text variant="titleMedium">Your list is empty</Text>
      <Text style={styles.hint}>Add your first item above.</Text>
    </View>
  );
  if (status === 'loading') {
    emptyComponent = <ListSkeleton />;
  } else if (status === 'error') {
    emptyComponent = <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <View style={styles.screen}>
      <OfflineBanner />

      <View style={styles.addRow}>
        <TextInput
          mode="outlined"
          dense
          label="Add an item"
          accessibilityLabel="New item"
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleAdd}
          loading={adding}
          disabled={adding || name.trim() === ''}
        >
          Add
        </Button>
      </View>

      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={emptyComponent}
        extraData={tags}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        renderItem={renderItem}
      />

      <Snackbar
        visible={message !== ''}
        onDismiss={() => setMessage('')}
        duration={3000}
        action={needsSettings ? { label: 'Settings', onPress: () => Linking.openSettings() } : undefined}
      >
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  input: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  hint: {
    color: colors.muted,
  },
});