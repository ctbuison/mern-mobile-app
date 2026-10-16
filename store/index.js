import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import profileReducer from './profileSlice';
import listReducer from './listSlice';
import tagsReducer from './tagsSlice';
import { logger } from './logger';

// Some slices hold things that must NOT survive a restart (a saved "loading" status, a running upload).
// Those slices get their own persist config that names only the fields worth keeping.
const productsPersistConfig = {
  key: 'products',
  storage: AsyncStorage,
  whitelist: ['items', 'lastUpdated'],
};

const profilePersistConfig = {
  key: 'profile',
  storage: AsyncStorage,
  whitelist: ['avatarUrl', 'pendingAvatar'],
};

const listPersistConfig = {
  key: 'list',
  storage: AsyncStorage,
  whitelist: ['items', 'lastUpdated'],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  list: persistReducer(listPersistConfig, listReducer),
  products: persistReducer(productsPersistConfig, productsReducer),
  profile: persistReducer(profilePersistConfig, profileReducer),
  tags: tagsReducer,
});

// The root config saves everything except the slices above, which persist themselves.
const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['products', 'profile', 'list'],
};

export const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) => {
    // redux-persist's own actions carry functions, which the serializable check would complain about.
    const defaults = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
    return __DEV__ ? defaults.concat(logger) : defaults;
  },
  // Redux Toolkit's built-in DevTools expect a browser extension. In Expo we use the Expo plugin instead.
  devTools: false,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(devToolsEnhancer()),
});

// persistStore starts saving the store to AsyncStorage and loading it back at launch.
export const persistor = persistStore(store);