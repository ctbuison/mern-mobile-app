import * as Updates from 'expo-updates';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../theme';

export default function UpdateInfo() {
  const updateId = Updates.updateId ?? 'embedded (no update downloaded)';
  const channel = Updates.channel || 'none';

  return (
    <>
      <Text style={styles.hint}>Release: 1.0.0 (first build)</Text>
      <Text style={styles.hint}>Channel: {channel}</Text>
      <Text style={styles.hint}>Update ID: {updateId}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: colors.muted,
    textAlign: 'center',
  },
});