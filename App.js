import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './context/AuthContext';
import { paperTheme } from './theme';

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style="dark" />
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}