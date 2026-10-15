import { api } from '../lib/api';

// The API's shape (_id, populated category object) stays in this file.
// The rest of the app only ever sees the shape Day 3's screens already expect.
export function mapProduct(raw) {
  return {
    id: raw._id,
    name: raw.name,
    price: raw.price,
    category: raw.category?.name ?? 'Uncategorized',
    inStock: raw.inStock,
    description: raw.description,
    imageUrl: raw.imageUrl,
  };
}

export async function fetchProducts() {
  const response = await api.get('/products');
  return response.data.data.map(mapProduct);
}

export async function fetchProduct(id) {
  const response = await api.get(`/products/${id}`);
  return mapProduct(response.data.data);
}