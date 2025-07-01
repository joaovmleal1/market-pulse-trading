import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, logout as logoutAction } from '../store/reducers/token';
import { withTokenRetry } from '../utils/reqAuth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthUser {
    id: number;
    complete_name: string;
    email: string;
    last_login: string;
    is_superuser: boolean;
    is_active: boolean;
    activated_at: Date;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (username: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
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
    const [hasBooted, setHasBooted] = useState(false);
    const dispatch = useDispatch();
    const { accessToken, refreshToken } = useSelector((state: any) => state.token);
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'https://api.multitradingob.com/user',
    });

    // Etapa 1: carregar token do localStorage no Redux
    useEffect(() => {
        const localToken = localStorage.getItem('tokenState');
        if (localToken) {
            const parsed = JSON.parse(localToken);
            dispatch(loginAction(parsed));
        }
        setHasBooted(true);
    }, []);

    // Etapa 2: quando Redux tiver token, buscar o usuário
    useEffect(() => {
        if (hasBooted && accessToken && !user) {
            fetchUser();
        } else if (hasBooted && !accessToken) {
            setIsLoading(false);
        }
    }, [hasBooted, accessToken]);

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
                setUser(userData);
                return;
            }

            setUser(userData);
        } catch (err) {
            console.error('Erro ao buscar usuário logado:', err);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (
        username: string,
        password: string,
        rememberMe = true
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

            dispatch(loginAction({ accessToken: access_token, refreshToken: refresh_token }));

            if (rememberMe) {
                localStorage.setItem(
                    'tokenState',
                    JSON.stringify({ accessToken: access_token, refreshToken: refresh_token })
                );
            }

            await fetchUser();
            return { success: true };
        } catch (err: any) {
            const message = err?.response?.data?.detail || 'Erro inesperado no login. Tente novamente.';
            console.error('Erro no login:', message);
            return { success: false, message };
        }
    };

    const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const username = email;
            const basicUser = import.meta.env.VITE_BASIC_AUTH_USER;
            const basicPass = import.meta.env.VITE_BASIC_AUTH_PASS;
            const credentials = btoa(`${basicUser}:${basicPass}`);

            await axios.post(
                `${api.defaults.baseURL}/create`,
                {
                    complete_name: name,
                    email,
                    password,
                    is_superuser: false,
                },
                {
                    headers: {
                        Authorization: `Basic ${credentials}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return await login(username, password);
        } catch (err) {
            console.error('Erro no registro:', err);
            return { success: false, message: 'Erro ao registrar usuário' };
        }
    };

    const logout = () => {
        dispatch(logoutAction());
        localStorage.removeItem('tokenState');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export async function refreshToken(currentToken: string): Promise<string> {
    try {
        const response = await fetch('https://api.multitradingob.com/user/refresh', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${currentToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.access_token as string;
    } catch (error) {
        console.error('Erro ao atualizar token:', error);
        throw error;
    }
}
