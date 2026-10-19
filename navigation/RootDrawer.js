import { createDrawerNavigator } from '@react-navigation/drawer';
import MainTabs from './MainTabs';
import AppDrawerContent from '../components/AppDrawerContent';
import AboutScreen from '../screens/AboutScreen';
import LocationScreen from '../screens/LocationScreen';
import StressTestScreen from '../screens/StressTestScreen';
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
      <Drawer.Screen name="StressTest" component={StressTestScreen} options={{ title: 'Stress test' }} />
      <Drawer.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </Drawer.Navigator>
  );
}