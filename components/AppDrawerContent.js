import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { colors, spacing } from '../theme';

export default function AppDrawerContent(props) {
  const handleSignOut = () => {
    props.navigation.closeDrawer();
    console.log('Sign out pressed (wired up in Module 7)');
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.brand}>
          Shopfront
        </Text>
        <Text style={styles.tagline}>Everyday essentials</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem label="Sign out" onPress={handleSignOut} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  brand: {
    color: colors.primary,
    fontWeight: '700',
  },
  tagline: {
    color: colors.muted,
  },
});