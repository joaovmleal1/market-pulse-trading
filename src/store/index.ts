import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './reducers/token';

// Função para carregar estado salvo
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('tokenState');
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Erro ao carregar tokenState do localStorage', e);
    return undefined;
  }
};

// Função para salvar estado
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('tokenState', serializedState);
  } catch (e) {
    console.warn('Erro ao salvar tokenState no localStorage', e);
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

// Sempre que o estado do token mudar, salva no localStorage
store.subscribe(() => {
  saveState(store.getState().token);
});

export default store;
