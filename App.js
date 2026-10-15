import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import { paperTheme, colors } from './theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.primary,
            headerTitleStyle: { fontWeight: '600' },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen
            name="ProductList"
            component={ProductListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ title: 'Product' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}