export function formatPrice(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Price unavailable';
  }

  return `₱${value.toFixed(2)}`;
}