// "Oct 2, 3:42 PM" - used to say how old saved data is.
export function formatUpdated(iso) {
  if (!iso) return 'earlier';
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}


export function formatPrice(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'Price unavailable';
  }

  return `₱${value.toFixed(2)}`;
}