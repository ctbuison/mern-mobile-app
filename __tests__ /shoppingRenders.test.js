import { Provider } from 'react-redux';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import { store } from '../store';

jest.mock('../services/tasks', () => ({
  fetchItems: jest.fn(),
  createItem: jest.fn(),
  deleteItem: jest.fn(),
  setItemDone: jest.fn(),
}));
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1', email: 'trainee@shopfront.test' }, status: 'signedIn' }),
}));
jest.mock('../lib/location', () => ({
  ensureLocationPermission: jest.fn().mockResolvedValue({ granted: true }),
  getCurrentCoords: jest.fn().mockResolvedValue({ latitude: 14.5995, longitude: 120.9842 }),
}));

const { fetchItems } = require('../services/tasks');

const ITEMS = Array.from({ length: 8 }, (_, i) => ({ id: `t${i}`, name: `Item ${i}`, done: false, ownerId: 'u1' }));

let rowRenders = 0;
beforeEach(() => {
  rowRenders = 0;
  jest.spyOn(console, 'log').mockImplementation((tag, name) => {
    if (tag === '[render]' && name === 'ShoppingRow') rowRenders += 1;
  });
});
afterEach(() => jest.restoreAllMocks());

async function mountScreen() {
  fetchItems.mockResolvedValue(ITEMS);
  render(
    <Provider store={store}>
      <ShoppingListScreen />
    </Provider>
  );
  await waitFor(() => expect(screen.getByText('Item 0')).toBeTruthy());
}

test('typing in the add box does not re-render the rows', async () => {
  await mountScreen();
  const user = userEvent.setup();
  rowRenders = 0;
  await user.type(screen.getByLabelText('New item'), 'milk');
  console.info('TYPE row renders:', rowRenders);
  expect(rowRenders).toBe(0);
});

test('tagging one item re-renders only that row', async () => {
  await mountScreen();
  const user = userEvent.setup();
  rowRenders = 0;
  await user.press(screen.getByLabelText('Tag Item 3 with my location'));
  await waitFor(() => expect(screen.getByText(/Tagged at/)).toBeTruthy());
  console.info('TAG row renders:', rowRenders);
  expect(rowRenders).toBe(1);
});

test('typing in the add box does not recompute the list summary', async () => {
  const { summaryStats } = require('../components/ListSummary');
  await mountScreen();
  const user = userEvent.setup();
  summaryStats.computeCount = 0;
  await user.type(screen.getByLabelText('New item'), 'milk');
  console.info('SUMMARY computes while typing "milk":', summaryStats.computeCount);
  expect(summaryStats.computeCount).toBe(0);
});