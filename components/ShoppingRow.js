import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, List } from 'react-native-paper';
import { formatCoords } from '../utils/format';
import { renderLog } from '../lib/renderLog';
import { colors } from '../theme';

// One row of the shopping list. It only needs its own item, its own tag (or undefined)
// and three stable callbacks, so memo can skip it whenever none of those changed.
function ShoppingRow({ item, tag, onToggle, onTag, onRemove }) {
  renderLog('ShoppingRow', item.id);

  return (
    <List.Item
      title={item.name}
      description={tag ? `Tagged at ${formatCoords(tag)}` : undefined}
      titleStyle={item.done && styles.done}
      accessibilityRole="checkbox"
      accessibilityLabel={item.name}
      accessibilityState={{ checked: item.done }}
      onPress={() => onToggle(item)}
      left={(props) => (
        <List.Icon
          {...props}
          icon={item.done ? 'checkbox-marked' : 'checkbox-blank-outline'}
          color={item.done ? colors.success : colors.muted}
        />
      )}
      right={() => (
        <View style={styles.actions}>
          <IconButton
            icon={tag ? 'map-marker-check' : 'map-marker-plus-outline'}
            iconColor={tag ? colors.primary : colors.muted}
            accessibilityLabel={
              tag ? `Remove location tag from ${item.name}` : `Tag ${item.name} with my location`
            }
            onPress={() => onTag(item, Boolean(tag))}
          />
          <IconButton
            icon="delete-outline"
            accessibilityLabel={`Remove ${item.name}`}
            onPress={() => onRemove(item)}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  done: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
});

export default memo(ShoppingRow);