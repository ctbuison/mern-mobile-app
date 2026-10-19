const CATEGORIES = ['Food', 'Drinks', 'Home', 'Tech'];

export function generateRows(count) {
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    rows.push({
      id: `row-${i}`,
      name: `Item ${i + 1}`,
      category: CATEGORIES[i % CATEGORIES.length],
      price: 50 + (i % 40) * 5,
    });
  }
  return rows;
}