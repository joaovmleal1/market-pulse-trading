// ✅ store.ts
import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './reducers/token';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('tokenState');
    if (!serializedState) return undefined;
    return { token: JSON.parse(serializedState) };
  } catch (e) {
    console.warn('Erro ao carregar tokenState do localStorage', e);
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('tokenState', serializedState);
  } catch (e) {
    console.warn('Erro ao salvar tokenState no localStorage', e);
  }
};

const store = configureStore({
  reducer: {
    token: tokenReducer,
  },
  preloadedState: loadState(),
});

let firstRun = true;
store.subscribe(() => {
  if (firstRun) {
    firstRun = false;
    return;
  }
  saveState(store.getState().token);
});

export default store;