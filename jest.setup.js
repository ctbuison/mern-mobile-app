// Jest does not read .env, so give config.js the value it insists on.
process.env.EXPO_PUBLIC_API_URL = "http://localhost:3000/api";

// Mocks for native modules that do not exist in Node.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js')
);
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default
);
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => {}),
  deleteItemAsync: jest.fn(async () => {}),
}));
// The Redux DevTools plugin needs a running Metro server. In tests it is a no-op enhancer.
jest.mock('redux-devtools-expo-dev-plugin', () => ({
  __esModule: true,
  default: () => (createStore) => createStore,
}));
// The action logger prints every Redux action. Tests stay quiet.
jest.mock('./store/logger', () => ({
  logger: () => (next) => (action) => next(action),
}));
// Paper draws icons with a font that loads asynchronously, which triggers "not wrapped in act" warnings.
// A plain View with the icon's name keeps tests quiet.
jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: ({ name }) => <View testID={`icon-${name}`} /> };
});