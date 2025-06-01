
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

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
            .single();

          if (!existingUser) {
            // Hash da senha
            const hashedPassword = await bcrypt.hash(localUser.password, 10);
            
            // Inserir usuário no Supabase
            const { error } = await supabase
              .from('users')
              .insert({
                name: localUser.name,
                email: localUser.email,
                password_hash: hashedPassword
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
    // Configurar listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Buscar dados adicionais do usuário na tabela users
          fetchUserData(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    // Executar migração dos usuários do localStorage
    migrateLocalStorageUsers();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userData && !error) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Buscar usuário por email
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !userData) {
        return false;
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, userData.password_hash);
      
      if (isValidPassword) {
        // Simular login com Supabase Auth (para manter compatibilidade)
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email
        });
        
        // Salvar no localStorage para persistência
        localStorage.setItem('multitrading_user', JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email
        }));
        
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
        .single();

      if (existingUser) {
        return false; // Usuário já existe
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir novo usuário
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          name,
          email,
          password_hash: hashedPassword
        })
        .select()
        .single();

      if (error || !newUser) {
        return false;
      }

      // Fazer login automaticamente após registro
      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      });

      // Salvar no localStorage para persistência
      localStorage.setItem('multitrading_user', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }));

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
