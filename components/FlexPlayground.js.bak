import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

const DIRECTIONS = ['column', 'row', 'column-reverse', 'row-reverse'];
const JUSTIFY = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
];
const ALIGN = ['stretch', 'flex-start', 'center', 'flex-end'];

function nextValue(list, current) {
  return list[(list.indexOf(current) + 1) % list.length];
}

function ControlButton({ label, value, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.control, pressed && styles.controlPressed]}
    >
      <Text style={styles.controlLabel}>{label}</Text>
      <Text style={styles.controlValue}>{value}</Text>
    </Pressable>
  );
}

export default function FlexPlayground() {
  const [flexDirection, setFlexDirection] = useState('column');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Tap a button to cycle its value.</Text>

      <View style={styles.controls}>
        <ControlButton
          label="flexDirection"
          value={flexDirection}
          onPress={() => setFlexDirection(nextValue(DIRECTIONS, flexDirection))}
        />
        <ControlButton
          label="justifyContent"
          value={justifyContent}
          onPress={() => setJustifyContent(nextValue(JUSTIFY, justifyContent))}
        />
        <ControlButton
          label="alignItems"
          value={alignItems}
          onPress={() => setAlignItems(nextValue(ALIGN, alignItems))}
        />
      </View>

      <View style={[styles.box, { flexDirection, justifyContent, alignItems }]}>
        <View style={[styles.item, { backgroundColor: '#ef9a9a' }]}>
          <Text style={styles.itemText}>1</Text>
        </View>
        <View style={[styles.item, { backgroundColor: '#a5d6a7' }]}>
          <Text style={styles.itemText}>2</Text>
        </View>
        <View style={[styles.item, { backgroundColor: '#90caf9' }]}>
          <Text style={styles.itemText}>3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  hint: {
    color: colors.muted,
  },
  controls: {
    gap: spacing.sm,
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  controlPressed: {
    opacity: 0.6,
  },
  controlLabel: {
    fontWeight: '600',
    color: colors.text,
  },
  controlValue: {
    color: colors.primary,
    fontWeight: '600',
  },
  box: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  item: {
    minWidth: 64,
    minHeight: 64,
    margin: 4,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});