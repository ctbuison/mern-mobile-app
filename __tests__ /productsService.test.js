import { fetchProducts, fetchProduct } from '../services/products';

// Replace the shared Axios instance with a fake. No network, no server, no waiting.
jest.mock('../lib/api', () => ({
  api: { get: jest.fn() },
}));
const { api } = require('../lib/api');

const rawTote = {
  _id: 'abc123',
  name: 'Canvas Tote Bag',
  price: 450,
  category: { name: 'Accessories' },
  inStock: true,
  description: 'A sturdy tote.',
  imageUrl: 'https://picsum.photos/seed/tote/600/400',
};

afterEach(() => jest.clearAllMocks());

test('fetchProducts maps the API shape to the app shape', async () => {
  api.get.mockResolvedValue({ data: { data: [rawTote] } });

  const products = await fetchProducts();

  expect(api.get).toHaveBeenCalledWith('/products');
  expect(products).toEqual([
    {
      id: 'abc123',
      name: 'Canvas Tote Bag',
      price: 450,
      category: 'Accessories',
      inStock: true,
      description: 'A sturdy tote.',
      imageUrl: 'https://picsum.photos/seed/tote/600/400',
    },
  ]);
});

test('a product without a category becomes Uncategorized', async () => {
  api.get.mockResolvedValue({ data: { data: { ...rawTote, category: undefined } } });
  const product = await fetchProduct('abc123');
  expect(api.get).toHaveBeenCalledWith('/products/abc123');
  expect(product.category).toBe('Uncategorized');
});

test('a failed request rejects so the caller can show an error', async () => {
  api.get.mockRejectedValue(new Error('Network Error'));
  await expect(fetchProducts()).rejects.toThrow('Network Error');
});