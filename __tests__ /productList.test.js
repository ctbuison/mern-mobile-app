import { Provider } from 'react-redux';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import ProductListScreen from '../screens/ProductListScreen';
import { store } from '../store';
import { products } from '../data/products';

jest.mock('../services/products', () => ({
  fetchProducts: jest.fn(),
}));
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 'trainee@shopfront.test' }, status: 'signedIn' }),
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ name: 'Products', params: undefined }),
  useNavigation: () => ({ navigate: jest.fn(), dispatch: jest.fn() }),
}));

const { fetchProducts } = require('../services/products');

test('shows products after load', async () => {
  fetchProducts.mockResolvedValue(products);
  render(
    <Provider store={store}>
      <ProductListScreen navigation={{ navigate: jest.fn(), dispatch: jest.fn() }} />
    </Provider>
  );
  await waitFor(() => expect(screen.getByText('Canvas Tote Bag')).toBeTruthy());
});