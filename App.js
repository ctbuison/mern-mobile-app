import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { store } from './store';
import { paperTheme } from './theme';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={paperTheme}>
        <StatusBar style="dark" />
        <ErrorBoundary>
          <AuthProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </ErrorBoundary>
      </PaperProvider>
    </Provider>
  );
}