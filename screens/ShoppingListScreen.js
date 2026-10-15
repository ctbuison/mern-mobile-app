import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Button, Checkbox, IconButton, Snackbar, Text, TextInput } from 'react-native-paper';
import ErrorState from '../components/ErrorState';
import ListSkeleton from '../components/ListSkeleton';
import useShoppingList from '../hooks/useShoppingList';
import { colors, spacing } from '../theme';

function EmptyList() {
  return <Text style={styles.empty}>Your shopping list is empty. Add your first item above.</Text>;
}

export default function ShoppingListScreen() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);
  const { items, status, error, refreshing, reload, refresh, add, toggle, remove } =
    useShoppingList();

  const handleAdd = async () => {
    setAdding(true);
    try {
      const result = await add(name);
      if (result.ok) {
        setName('');
      } else {
        setMessage(result.message);
      }
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (item) => {
    const result = await toggle(item);
    if (!result.ok) setMessage(result.message);
  };

  const handleRemove = async (item) => {
    const result = await remove(item);
    if (!result.ok) setMessage(result.message);
  };

  const handleRefresh = async () => {
    const worked = await refresh();
    if (!worked) setMessage('Could not refresh. Showing the items from earlier.');
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
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
            <IconButton
              icon="delete-outline"
              accessibilityLabel={`Remove ${item.name}`}
              onPress={() => handleRemove(item)}
            />
          </View>
        )}
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

      <Snackbar visible={message !== ''} onDismiss={() => setMessage('')} duration={2500}>
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
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  itemName: {
    flex: 1,
  },
  done: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
  urgent: {
    color: colors.danger,
    marginHorizontal: spacing.sm,
  },
});
