import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ShopStack from './ShopStack';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const tabIcon = (name) =>
  function TabIcon({ color, size }) {
    return <MaterialCommunityIcons name={name} color={color} size={size} />;
  };

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Shop"
        component={ShopStack}
        options={{ headerShown: false, tabBarIcon: tabIcon('storefront-outline') }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarIcon: tabIcon('cart-outline'), tabBarBadge: 3 }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: tabIcon('account-outline') }}
      />
    </Tab.Navigator>
  );
}