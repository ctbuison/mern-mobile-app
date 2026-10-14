import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import { paperTheme } from './theme';
export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style="dark" />
      {selectedProduct ? (
        <ProductDetailsScreen product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      ) : (
        <ProductListScreen onSelectProduct={setSelectedProduct} />
      )}
    </PaperProvider>
  );
}
