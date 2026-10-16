import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ShopStack from './ShopStack';
import CartScreen from '../screens/CartScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { selectCartCount } from '../store/cartSlice';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const tabIcon = (name) =>
  function TabIcon({ color, size }) {
    return <MaterialCommunityIcons name={name} color={color} size={size} />;
  };

export default function MainTabs() {
  const count = useSelector(selectCartCount);

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
        name="List"
        component={ShoppingListScreen}
        options={{
          title: 'Shopping list',
          tabBarLabel: 'List',
          tabBarIcon: tabIcon('format-list-checks'),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: tabIcon('cart-outline'),
          tabBarBadge: count > 0 ? count : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: tabIcon('account-outline') }}
      />
    </Tab.Navigator>
  );
}