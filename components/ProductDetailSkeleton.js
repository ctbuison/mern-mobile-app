import { StyleSheet } from 'react-native';
import { SkeletonPulse, SkeletonBlock } from './Skeleton';
import { spacing } from '../theme';

// Grey placeholders in the same arrangement as the real product page.
export default function ProductDetailSkeleton() {
  return (
    <SkeletonPulse accessibilityLabel="Loading product" style={styles.screen}>
      <SkeletonBlock style={styles.image} />
      <SkeletonBlock style={styles.title} />
      <SkeletonBlock style={styles.price} />
      <SkeletonBlock style={styles.line} />
      <SkeletonBlock style={styles.line} />
      <SkeletonBlock style={styles.shortLine} />
    </SkeletonPulse>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  image: {
    width: '100%',
    maxWidth: 480,
    aspectRatio: 1,
  },
  title: {
    height: 28,
    width: '70%',
  },
  price: {
    height: 24,
    width: '30%',
  },
  line: {
    height: 14,
    width: '100%',
  },
  shortLine: {
    height: 14,
    width: '60%',
  },
});