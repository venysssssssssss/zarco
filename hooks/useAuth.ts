import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { LoginCredentials, RegisterData } from '../types/auth';

export interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  error: string;
  loading: boolean;
  checkAuth: () => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError('');
      await authService.login(credentials);
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
      setError('');
      await authService.register(data);
      return Promise.resolve();
    } catch (err: any) {
      setError(err.message);
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const isAuthenticated = await authService.checkAuthStatus();
      return isAuthenticated;
    } catch (error) {
      console.error("Error checking auth status:", error);
      return false;
    }
  };

  return {
    login,
    register,
    error,
    loading,
    checkAuth
  };
}
