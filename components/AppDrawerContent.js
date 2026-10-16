import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { selectAvatarUri } from '../store/profileSlice';
import { selectProducts } from '../store/productsSlice';
import { colors, spacing } from '../theme';

export default function AppDrawerContent(props) {
  const { user, signOut } = useAuth();
  const avatarUri = useSelector(selectAvatarUri);
  const products = useSelector(selectProducts);
  const initial = (user?.email ?? '?').charAt(0).toUpperCase();

  const handleSignOut = () => {
    props.navigation.closeDrawer();
    signOut();
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        {avatarUri ? (
          <Avatar.Image size={48} source={{ uri: avatarUri }} />
        ) : (
          <Avatar.Text size={48} label={initial} />
        )}
        <View>
          <Text variant="headlineSmall" style={styles.brand}>
            Shopfront
          </Text>
          <Text style={styles.tagline}>{products.length} products</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem label="Sign out" onPress={handleSignOut} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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