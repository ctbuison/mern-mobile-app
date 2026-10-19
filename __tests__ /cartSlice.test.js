import reducer, { addItem, removeItem, clearCart, selectCartCount, selectCartTotal } from '../store/cartSlice';

const tote = { id: '1', name: 'Canvas Tote Bag', price: 450 };
const hat = { id: '3', name: 'Bucket Hat', price: 280 };

test('adding a product puts it in the cart with quantity 1', () => {
  const state = reducer(undefined, addItem(tote));
  expect(state.items).toEqual([{ product: tote, quantity: 1 }]);
});

test('adding the same product again increases its quantity', () => {
  let state = reducer(undefined, addItem(tote));
  state = reducer(state, addItem(tote, 2));
  expect(state.items).toHaveLength(1);
  expect(state.items[0].quantity).toBe(3);
});

test('removeItem and clearCart empty things out', () => {
  let state = reducer(undefined, addItem(tote));
  state = reducer(state, addItem(hat));
  state = reducer(state, removeItem('1'));
  expect(state.items.map((item) => item.product.id)).toEqual(['3']);
  expect(reducer(state, clearCart()).items).toEqual([]);
});

test('selectors work out the count and the total', () => {
  let cart = reducer(undefined, addItem(tote, 2));
  cart = reducer(cart, addItem(hat));
  const state = { cart };
  expect(selectCartCount(state)).toBe(3);
  expect(selectCartTotal(state)).toBe(450 * 2 + 280);
});