"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials, RegisterData } from '@/types/auth';
import { authService } from '@/services/authService';

interface IAccessMode {
  isGuest(): boolean;
  isAuthenticated(): boolean;
}

class GuestMode implements IAccessMode {
  isGuest(): boolean {
    return typeof window !== 'undefined' && sessionStorage.getItem('guest_mode') === 'true';
  }

  isAuthenticated(): boolean {
    return false;
  }
}

class AuthenticatedMode implements IAccessMode {
  constructor(private authStatus: boolean) {}

  isGuest(): boolean {
    return false;
  }

  isAuthenticated(): boolean {
    return this.authStatus;
  }
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Primeiro verificar se está em modo visitante
        const guestMode = new GuestMode();
        if (guestMode.isGuest()) {
          setIsGuest(true);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Se não é visitante, verificar autenticação
        const isAuthenticated = await authService.checkAuthStatus();
        setIsAuthenticated(isAuthenticated);
        
        if (isAuthenticated) {
          try {
            const userData = await authService.getCurrentUser();
            if (userData) {
              setUser(userData);
            }
          } catch (error) {
            console.error('Erro ao recuperar dados do usuário:', error);
            // Se falhar ao buscar dados do usuário, desautenticar
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Desabilitar modo visitante antes do login
      disableGuestMode();
      
      const { user } = await authService.login(credentials);
      setUser(user);
      setIsAuthenticated(true);
      setIsGuest(false);
      router.push('/welcome');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Desabilitar modo visitante antes do registro
      disableGuestMode();
      
      await authService.register(data);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setIsGuest(false);
      
      // Limpar dados locais
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('guest_mode');
        localStorage.removeItem('guest_cart');
        localStorage.removeItem('guest_wishlist');
      }
      
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const enableGuestMode = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('guest_mode', 'true');
      // Inicializar dados locais para visitante se não existirem
      if (!localStorage.getItem('guest_cart')) {
        localStorage.setItem('guest_cart', JSON.stringify([]));
      }
      if (!localStorage.getItem('guest_wishlist')) {
        localStorage.setItem('guest_wishlist', JSON.stringify([]));
      }
    }
    setIsGuest(true);
    setIsAuthenticated(false);
    setUser(null);
  };

  const disableGuestMode = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('guest_mode');
    }
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isGuest,
      loading,
      error,
      login,
      register,
      logout,
      setUser,
      clearError,
      enableGuestMode,
      disableGuestMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
}
