import { useState } from 'react';
import { FlatList, Linking, RefreshControl, StyleSheet, View } from 'react-native';
import { Button, Checkbox, IconButton, Snackbar, Text, TextInput } from 'react-native-paper';
import ErrorState from '../components/ErrorState';
import ListSkeleton from '../components/ListSkeleton';
import useLocationTags from '../hooks/useLocationTags';
import useShoppingList from '../hooks/useShoppingList';
import { formatCoords } from '../utils/format';
import { colors, spacing } from '../theme';

function EmptyList() {
  return <Text style={styles.empty}>Your shopping list is empty. Add your first item above.</Text>;
}

export default function ShoppingListScreen() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);
  const [needsSettings, setNeedsSettings] = useState(false);
  const { items, status, error, refreshing, reload, refresh, add, toggle, remove } =
    useShoppingList();
  const { tags, tagItem, clearTag } = useLocationTags();

  const report = (result) => {
    if (!result.ok) {
      setNeedsSettings(false);
      setMessage(result.message);
    }
  };

  const handleAdd = async () => {
    setAdding(true);
    try {
      const result = await add(name);
      if (result.ok) {
        setName('');
      } else {
        report(result);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (item) => {
    report(await toggle(item));
  };

  const handleRemove = async (item) => {
    report(await remove(item));
  };

  const handleTag = async (item) => {
    setNeedsSettings(false);
    if (tags[item.id]) {
      clearTag(item.id);
      return;
    }

    const result = await tagItem(item.id);
    if (!result.ok) {
      setNeedsSettings(result.needsSettings);
      setMessage(result.message);
    }
  };

  const openSettings = async () => {
    setNeedsSettings(false);
    try {
      await Linking.openSettings();
    } catch {
      setMessage('Could not open Settings. Please open it manually.');
    }
  };

  const handleRefresh = async () => {
    const worked = await refresh();
    if (!worked) {
      setNeedsSettings(false);
      setMessage('Could not refresh. Showing the items from earlier.');
    }
  };

  if (status === 'loading') {
    return (
      <View style={styles.screen}>
        <ListSkeleton />
      </View>
    );
  }

  if (status === 'error') {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.addRow}>
        <TextInput
          mode="outlined"
          label="New item"
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          style={styles.input}
          accessibilityLabel="New shopping list item"
        />
        <Button
          mode="contained"
          onPress={handleAdd}
          disabled={!name.trim() || adding}
          loading={adding}
          style={styles.addButton}
        >
          Add
        </Button>
      </View>

      <FlatList
        data={items}
        extraData={tags}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const tag = tags[item.id];
          return (
            <View style={styles.itemContainer}>
              <View style={styles.itemContent}>
                <Checkbox
                  status={item.done ? 'checked' : 'unchecked'}
                  onPress={() => handleToggle(item)}
                  accessibilityLabel={`Mark ${item.name} ${item.done ? 'not done' : 'done'}`}
                />
                <Text
                  variant="bodyLarge"
                  style={[styles.itemName, item.done && styles.done]}
                  onPress={() => handleToggle(item)}
                >
                  {item.name}
                </Text>
                {item.urgent && <Text style={styles.urgent}>Urgent</Text>}
                <View style={styles.actions}>
                  <IconButton
                    icon={tag ? 'map-marker-check' : 'map-marker-plus-outline'}
                    iconColor={tag ? colors.primary : colors.muted}
                    accessibilityLabel={
                      tag
                        ? `Remove location tag from ${item.name}`
                        : `Tag ${item.name} with my location`
                    }
                    onPress={() => handleTag(item)}
                  />
                  <IconButton
                    icon="delete-outline"
                    accessibilityLabel={`Remove ${item.name}`}
                    onPress={() => handleRemove(item)}
                  />
                </View>
              </View>
              {tag && (
                <Text style={styles.locationTag}>
                  Tagged at {formatCoords(tag)}
                </Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<EmptyList />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={items.length === 0 ? styles.emptyContent : styles.listContent}
        keyboardShouldPersistTaps="handled"
      />

      <Snackbar
        visible={message !== ''}
        onDismiss={() => {
          setMessage('');
          setNeedsSettings(false);
        }}
        duration={3500}
        action={needsSettings ? { label: 'Settings', onPress: openSettings } : undefined}
      >
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  addButton: {
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    padding: spacing.xl,
  },
  itemContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  itemContent: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  done: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
  urgent: {
    color: colors.danger,
    marginHorizontal: spacing.sm,
  },
  locationTag: {
    color: colors.muted,
    fontSize: 12,
    paddingLeft: spacing.xl,
    paddingBottom: spacing.xs,
  },
});
