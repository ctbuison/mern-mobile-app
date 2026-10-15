import { View, StyleSheet } from 'react-native';
import { SkeletonPulse, SkeletonBlock } from './Skeleton';
import { spacing } from '../theme';

const ROWS = 5;

export default function ListSkeleton() {
  return (
    <SkeletonPulse accessibilityLabel="Loading your list" style={styles.list}>
      {Array.from({ length: ROWS }, (_, index) => (
        <SkeletonBlock key={index} style={styles.row} />
      ))}
    </SkeletonPulse>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    height: 48,
    width: '100%',
  },
});
