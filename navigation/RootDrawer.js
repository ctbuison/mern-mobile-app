import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabs from './MainTabs';
import AppDrawerContent from '../components/AppDrawerContent';
import AboutScreen from '../screens/AboutScreen';
import LocationScreen from '../screens/LocationScreen';
import PushDemoScreen from '../screens/PushDemoScreen';
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
      <Drawer.Screen name="Location" component={LocationScreen} options={{ title: 'My location' }} />
      <Drawer.Screen name="PushDemo" component={PushDemoScreen} options={{ title: 'Push demo (trainer)' }} />
      <Drawer.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </Drawer.Navigator>
  );
}