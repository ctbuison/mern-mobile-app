import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootDrawer from './navigation/RootDrawer';
import { paperTheme } from './theme';

export default function App() {
  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <RootDrawer />
      </NavigationContainer>
    </PaperProvider>
  );
}