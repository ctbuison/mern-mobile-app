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

let cardRenders = 0;
let consoleLog;

beforeEach(() => {
  cardRenders = 0;
  fetchProducts.mockResolvedValue(products);
  consoleLog = jest.spyOn(console, 'log').mockImplementation((tag, name) => {
    if (tag === '[render]' && name === 'ProductCard') {
      cardRenders += 1;
    }
  });
});

afterEach(() => {
  consoleLog.mockRestore();
});

async function renderProductList() {
  const user = userEvent.setup();
  render(
    <Provider store={store}>
      <ProductListScreen navigation={{ navigate: jest.fn(), dispatch: jest.fn() }} />
    </Provider>
  );
  await waitFor(() => expect(screen.getByText('Canvas Tote Bag')).toBeTruthy());
  cardRenders = 0;
  return user;
}

test('adding a product does not rerender product cards', async () => {
  const user = await renderProductList();

  await user.press(screen.getByLabelText('Add Canvas Tote Bag to cart'));
  await waitFor(() => expect(screen.getByText('Canvas Tote Bag added to cart')).toBeTruthy());

  expect(cardRenders).toBe(0);
});

test('typing in search does not rerender product cards', async () => {
  const user = await renderProductList();

  await user.type(screen.getByPlaceholderText('Search products'), 'a');

  expect(cardRenders).toBe(0);
});
