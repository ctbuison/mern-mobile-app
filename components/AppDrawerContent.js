import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import useProducts from '../hooks/useProducts';
import { colors, spacing } from '../theme';

export default function AppDrawerContent(props) {
  const { signOut } = useAuth();
  const { products } = useProducts();

  const handleSignOut = () => {
    props.navigation.closeDrawer();
    signOut();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.brand}>
          Shopfront
        </Text>
        <Text style={styles.tagline}>{products.length} products</Text>
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