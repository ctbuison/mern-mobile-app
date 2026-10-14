export function padToFullRows(list, columns) {
  const remainder = list.length % columns;
  if (remainder === 0) {
    return list;
  }
  const spacers = Array.from({ length: columns - remainder }, (_, index) => ({
    id: `spacer-${index}`,
    spacer: true,
  }));
  return [...list, ...spacers];
}