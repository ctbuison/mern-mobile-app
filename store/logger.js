// A middleware sits between dispatch(action) and the reducers. This one just prints each action.
// The extra arrows are how Redux hands a middleware the store, then "next", then the action.
function describe(payload) {
  if (payload === undefined) return '';
  if (Array.isArray(payload)) return `array(${payload.length})`;
  if (payload !== null && typeof payload === 'object') return `{ ${Object.keys(payload).join(', ')} }`;
  return String(payload);
}

export const logger = () => (next) => (action) => {
  console.log('[redux]', action.type, describe(action.payload));
  return next(action);
};