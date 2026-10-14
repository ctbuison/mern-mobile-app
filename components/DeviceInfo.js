import { View, Platform, PixelRatio, StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useBreakpoint from '../hooks/useBreakpoint';
import { spacing } from '../theme';

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text variant="labelLarge">{label}</Text>
      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
}

export default function DeviceInfo() {
  const { width, height, fontScale } = useWindowDimensions();
  const { numColumns, isLandscape } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const isPad = Platform.OS === 'ios' && Platform.isPad;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Row label="Platform" value={`${Platform.OS} ${Platform.Version}`} />
        <Row label="Device type" value={isPad ? 'iPad' : 'iPhone / other'} />
        <Row label="Window" value={`${Math.round(width)} x ${Math.round(height)}`} />
        <Row label="Orientation" value={isLandscape ? 'Landscape' : 'Portrait'} />
        <Row label="Pixel ratio" value={String(PixelRatio.get())} />
        <Row label="Font scale" value={String(fontScale)} />
        <Row label="Insets (T / B)" value={`${insets.top} / ${insets.bottom}`} />
        <Row label="Insets (L / R)" value={`${insets.left} / ${insets.right}`} />
        <Row label="Grid columns" value={String(numColumns)} />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  content: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});