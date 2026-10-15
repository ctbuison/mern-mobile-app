import { View, StyleSheet } from 'react-native';
import { SkeletonPulse, SkeletonBlock } from './Skeleton';
import { colors, radius, spacing } from '../theme';

const ROWS = 3;

function CardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonBlock style={styles.image} />
      <SkeletonBlock style={styles.title} />
      <SkeletonBlock style={styles.category} />
      <SkeletonBlock style={styles.price} />
    </View>
  );
}

// Grey placeholder cards in the same grid as the real list, so nothing jumps when the data arrives.
export default function ProductListSkeleton({ numColumns }) {
  return (
    <SkeletonPulse accessibilityLabel="Loading products" style={styles.grid}>
      {Array.from({ length: ROWS }, (_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: numColumns }, (_, column) => (
            <CardSkeleton key={column} />
          ))}
        </View>
      ))}
    </SkeletonPulse>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  card: {
    flex: 1,
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  image: {
    height: 140,
  },
  title: {
    height: 16,
    width: '80%',
  },
  category: {
    height: 12,
    width: '45%',
  },
  price: {
    height: 16,
    width: '35%',
  },
});