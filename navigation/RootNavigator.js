import RootDrawer from './RootDrawer';
import AuthStack from './AuthStack';
import SplashScreen from '../components/SplashScreen';
import { CartProvider } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <SplashScreen />;
  }

  if (status === 'signedOut') {
    return <AuthStack />;
  }

  return (
    <CartProvider>
      <RootDrawer />
    </CartProvider>
  );
}