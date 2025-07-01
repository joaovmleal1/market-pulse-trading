// ✅ store.ts

import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './reducers/token';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('tokenState');
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const persistedToken = loadState();

const store = configureStore({
  reducer: {
    token: tokenReducer,
  },
  preloadedState: {
    token: persistedToken || {
      accessToken: "",
      refreshToken: "",
    },
  },
});

export default store;