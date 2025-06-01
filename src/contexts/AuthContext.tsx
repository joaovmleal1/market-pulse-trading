
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Função para migrar usuários do localStorage para Supabase
  const migrateLocalStorageUsers = async () => {
    const localUsers = JSON.parse(localStorage.getItem('multitrading_users') || '[]');
    
    if (localUsers.length > 0) {
      console.log('Migrando usuários do localStorage para Supabase...');
      
      for (const localUser of localUsers) {
        try {
          // Verificar se o usuário já existe no Supabase
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', localUser.email)
            .maybeSingle();

          if (!existingUser) {
            // Inserir usuário no Supabase (senha em texto simples para demo)
            const { error } = await supabase
              .from('users')
              .insert({
                name: localUser.name,
                email: localUser.email,
                password_hash: localUser.password // Para demo, usando senha simples
              });

            if (error) {
              console.error('Erro ao migrar usuário:', localUser.email, error);
            } else {
              console.log('Usuário migrado com sucesso:', localUser.email);
            }
          }
        } catch (error) {
          console.error('Erro durante migração:', error);
        }
      }
      
      // Limpar localStorage após migração
      localStorage.removeItem('multitrading_users');
      console.log('Migração concluída e localStorage limpo');
    }
  };

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('multitrading_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('multitrading_user');
      }
    }

    // Executar migração dos usuários do localStorage
    migrateLocalStorageUsers();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Buscar usuário por email
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error || !userData) {
        return false;
      }

      // Verificar senha (comparação simples para demo)
      const isValidPassword = userData.password_hash === password;
      
      if (isValidPassword) {
        const userInfo = {
          id: userData.id,
          name: userData.name,
          email: userData.email
        };
        
        setUser(userInfo);
        
        // Salvar no localStorage para persistência
        localStorage.setItem('multitrading_user', JSON.stringify(userInfo));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Verificar se o usuário já existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        return false; // Usuário já existe
      }

      // Inserir novo usuário (senha em texto simples para demo)
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          name,
          email,
          password_hash: password // Para demo, usando senha simples
        })
        .select()
        .single();

      if (error || !newUser) {
        return false;
      }

      const userInfo = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };

      // Fazer login automaticamente após registro
      setUser(userInfo);

      // Salvar no localStorage para persistência
      localStorage.setItem('multitrading_user', JSON.stringify(userInfo));

      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('multitrading_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
