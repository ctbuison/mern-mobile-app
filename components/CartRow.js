import { memo } from 'react';
import { IconButton, List } from 'react-native-paper';
import { formatPrice } from '../utils/format';
import { renderLog } from '../lib/renderLog';

function CartRow({ item, onRemove }) {
  renderLog('CartRow', item.product.id);

  return (
    <List.Item
      title={item.product.name}
      description={`${item.quantity} x ${formatPrice(item.product.price)}`}
      right={() => (
        <IconButton
          icon="delete-outline"
          accessibilityLabel={`Remove ${item.product.name}`}
          onPress={() => onRemove(item.product.id)}
        />
      )}
    />
  );
}

export default memo(CartRow);
