import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, logout as logoutAction } from '../store/reducers/token';
import { withTokenRetry } from '../utils/reqAuth'; // ✅ Caminho relativo correto
import axios from 'axios';
import store from '../store';
import { useNavigate } from 'react-router-dom';

interface AuthUser {
  id: number;
  complete_name: string;
  email: string;
  last_login: string;
  is_superuser: boolean;
  is_active: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector((state: any) => state.token);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'https://api.multitradingob.com/user', // ✅ Atualize se necessário
  });

  useEffect(() => {
    if (accessToken) {
      fetchUser();
    } else {
      setIsLoading(false); // mesmo sem token, finaliza o loading
    }
  }, [accessToken]);

  const fetchUser = async () => {
    try {
      const userData = await withTokenRetry(async (token) => {
        const res = await axios.get(`${api.defaults.baseURL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      });

      if (!userData.is_active) {
        console.warn('Usuário inativo.');
        navigate('/signature') // força logout se inativo
        return;
      }

      setUser(userData);
    } catch (err) {
      console.error('Erro ao buscar usuário logado:', err);
      logout(); // se o token estiver inválido
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await axios.post(
        `${api.defaults.baseURL}/login`,
        new URLSearchParams({ username, password }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, refresh_token } = res.data;

      dispatch(
        loginAction({
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      );

      await fetchUser();
      return { success: true };
    } catch (err: any) {
      const message =
        err?.response?.data?.detail || 'Erro inesperado no login. Tente novamente.';
      console.error('Erro no login:', message);
      return { success: false, message };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const [first_name, ...rest] = name.trim().split(" ");
      const last_name = rest.join(" ");
      const username = email; // ou gere um diferente, conforme sua lógica

      const basicUser = import.meta.env.VITE_BASIC_AUTH_USER;
      const basicPass = import.meta.env.VITE_BASIC_AUTH_PASS;

      const credentials = btoa(`${basicUser}:${basicPass}`);

      await axios.post(`${api.defaults.baseURL}/create`, {
        complete_name: name,
        email,
        password,
        is_superuser: false
      }, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      return await login(username, password);
    } catch (err) {
      console.error('Erro no registro:', err);
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    setUser(null);
    localStorage.removeItem('tokenState'); // Limpa token salvo
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

async function refreshToken(currentToken: string): Promise<string> {
  try {
    const response = await fetch('https://api.multitradingob.com/user/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Supondo que o JSON tenha a chave "access_token"
    return data.access_token as string;
  } catch (error) {
    console.error('Erro ao atualizar token:', error);
    throw error;
  }
}

export { refreshToken };