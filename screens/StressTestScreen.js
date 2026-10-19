import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { generateRows } from '../utils/generateRows';
import { colors, spacing } from '../theme';

const ROWS = generateRows(3000);
const ROW_HEIGHT = 72;

// The three props this screen tunes. These are React Native's defaults. Phase 4 changes them one at a time.
const TUNING = {
  initialNumToRender: 10,
  windowSize: 21,
  maxToRenderPerBatch: 10,
};

// How many rows are mounted right now. A row adds one when it mounts and takes one away when it unmounts.
let mountedRows = 0;

// memo: skip this row's render when none of its props changed (compared one by one, with ===).
const StressRow = memo(function StressRow({ item, onAdd }) {
  console.log('[row] render', item.id);

  useEffect(() => {
    mountedRows += 1;
    return () => {
      mountedRows -= 1;
    };
  }, []);

  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.category}</Text>
      </View>
      <Pressable onPress={onAdd} accessibilityRole="button" accessibilityLabel={`Add ${item.name}`}>
        <Text style={styles.add}>Add · ₱{item.price}</Text>
      </Pressable>
    </View>
  );
});

// Defined outside the component: their identity never changes.
const keyExtractor = (item) => item.id;

// Every row is exactly ROW_HEIGHT tall, so the position of row N is simple arithmetic.
const getItemLayout = (_data, index) => ({
  length: ROW_HEIGHT,
  offset: ROW_HEIGHT * index,
  index,
});

function MountedCounter() {
  const [count, setCount] = useState(mountedRows);

  useEffect(() => {
    const id = setInterval(() => setCount(mountedRows), 500);
    return () => clearInterval(id);
  }, []);

  return <Text style={styles.counter}>Mounted rows: {count}</Text>;
}

export default function StressTestScreen({ tuning = TUNING }) {
  const listRef = useRef(null);
  const [added, setAdded] = useState(0);

  // useCallback: the same function object on every render, so memo can compare it with ===.
  const handleAdd = useCallback(() => setAdded((n) => n + 1), []);

  const renderItem = useCallback(
    ({ item }) => <StressRow item={item} onAdd={handleAdd} />,
    [handleAdd]
  );

  const jump = () => listRef.current?.scrollToIndex({ index: 2499, animated: false });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Stress test · 3,000 rows · added: {added}</Text>
        <MountedCounter />
        <Pressable onPress={jump} accessibilityRole="button" style={styles.jump}>
          <Text style={styles.add}>Jump to row 2,500</Text>
        </Pressable>
      </View>
      <FlatList
        ref={listRef}
        testID="stress-list"
        data={ROWS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={tuning.initialNumToRender}
        windowSize={tuning.windowSize}
        maxToRenderPerBatch={tuning.maxToRenderPerBatch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, gap: spacing.xs },
  title: { fontWeight: '600' },
  counter: { color: colors.muted },
  jump: { paddingVertical: spacing.xs },
  row: {
    height: ROW_HEIGHT,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.muted,
  },
  name: { fontSize: 16 },
  meta: { color: colors.muted },
  add: { color: colors.primary, fontWeight: '600' },
});