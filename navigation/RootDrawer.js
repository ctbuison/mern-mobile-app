import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabs from './MainTabs';
import AppDrawerContent from '../components/AppDrawerContent';
import AboutScreen from '../screens/AboutScreen';
import { colors } from '../theme';

const Drawer = createDrawerNavigator();

export default function RootDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: colors.primary,
        headerTintColor: colors.primary,
      }}
    >
      <Drawer.Screen
        name="Main"
        component={MainTabs}
        options={{ title: 'Shopfront', headerShown: false }}
      />
      <Drawer.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </Drawer.Navigator>
  );
}