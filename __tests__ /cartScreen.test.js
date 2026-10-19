import { act, screen, userEvent } from '@testing-library/react-native';
import CartScreen from '../screens/CartScreen';
import { renderWithStore } from '../test-utils/renderWithStore';
import { addItem } from '../store/cartSlice';

const tote = { id: '1', name: 'Canvas Tote Bag', price: 450 };
const hat = { id: '3', name: 'Bucket Hat', price: 280 };

afterEach(() => {
  jest.restoreAllMocks();
});

test('shows a friendly message when the cart is empty', () => {
  renderWithStore(<CartScreen />);
  expect(screen.getByText('Your cart is empty')).toBeTruthy();
});

test('lists each item and the total', () => {
  renderWithStore(<CartScreen />, {
    preloadedState: { cart: { items: [{ product: tote, quantity: 2 }, { product: hat, quantity: 1 }] } },
  });
  expect(screen.getByText('Canvas Tote Bag')).toBeTruthy();
  expect(screen.getByText('2 x ₱450.00')).toBeTruthy();
  expect(screen.getByText('₱1180.00')).toBeTruthy();
});

test('removing an item updates the screen and the store', async () => {
  const user = userEvent.setup();
  const { store } = renderWithStore(<CartScreen />, {
    preloadedState: { cart: { items: [{ product: tote, quantity: 1 }, { product: hat, quantity: 1 }] } },
  });

  await user.press(screen.getByLabelText('Remove Canvas Tote Bag'));

  expect(screen.queryByText('Canvas Tote Bag')).toBeNull();
  expect(screen.getByText('Bucket Hat')).toBeTruthy();
  expect(store.getState().cart.items).toHaveLength(1);
});

test('adding to an existing cart item rerenders only that row', () => {
  const rowRenders = [];
  jest.spyOn(console, 'log').mockImplementation((tag, name, id) => {
    if (tag === '[render]' && name === 'CartRow') {
      rowRenders.push(id);
    }
  });
  const { store } = renderWithStore(<CartScreen />, {
    preloadedState: {
      cart: { items: [{ product: tote, quantity: 1 }, { product: hat, quantity: 1 }] },
    },
  });

  rowRenders.length = 0;
  act(() => {
    store.dispatch(addItem(tote));
  });
  expect(rowRenders).toEqual(['1']);
  expect(rowRenders).toEqual(['1']);
});