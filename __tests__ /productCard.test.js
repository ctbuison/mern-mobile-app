import { render, screen, userEvent } from '@testing-library/react-native';
import ProductCard from '../components/ProductCard';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const tote = {
  id: '1',
  name: 'Canvas Tote Bag',
  price: 450,
  category: 'Accessories',
  inStock: true,
  imageUrl: 'https://picsum.photos/seed/tote/600/400',
};

beforeEach(() => mockNavigate.mockClear());

test('VoiceOver gets one summary for the card and a separate Add button', () => {
  render(<ProductCard product={tote} onAdd={jest.fn()} />);

  expect(screen.getByRole('button', { name: 'Canvas Tote Bag, ₱450.00, in stock' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Add Canvas Tote Bag to cart' })).toBeTruthy();
});

test('tapping the card opens the product, tapping Add adds it', async () => {
  const user = userEvent.setup();
  const onAdd = jest.fn();
  render(<ProductCard product={tote} onAdd={onAdd} />);

  await user.press(screen.getByRole('button', { name: /Canvas Tote Bag, / }));
  expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', { productId: '1' });

  await user.press(screen.getByRole('button', { name: 'Add Canvas Tote Bag to cart' }));
  expect(onAdd).toHaveBeenCalledWith(tote);
});

test('an out-of-stock product says so and cannot be added', () => {
  render(<ProductCard product={{ ...tote, inStock: false }} onAdd={jest.fn()} />);

  expect(screen.getByRole('button', { name: 'Canvas Tote Bag, ₱450.00, out of stock' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Add Canvas Tote Bag to cart' })).toBeDisabled();
});