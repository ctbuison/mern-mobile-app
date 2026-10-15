import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import appConfig from '../app.json';
import { API_URL } from '../config';
import { colors, spacing } from '../theme';

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <Text variant="titleLarge">Shopfront</Text>
      <Text style={styles.hint}>Version {appConfig.expo.version}</Text>
      <Text style={styles.hint}>API: {API_URL}</Text>
      <Text style={styles.hint}>Built during the MERN Stack Mobile Hybrid Development bootcamp.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  hint: {
    color: colors.muted,
    textAlign: 'center',
  },
});