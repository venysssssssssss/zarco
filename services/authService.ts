import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  checkAuthStatus(): Promise<boolean>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
}

class AuthService implements IAuthService {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Falha ao fazer login");
    }

    return res.json();
  }

  async register({ name, email, password }: RegisterData): Promise<AuthResponse> {
    if (!name) {
      throw new Error("Nome é obrigatório");
    }
    
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Falha ao se registrar");
    }
    
    return res.json();
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/status');
      if (!res.ok) return false;
      
      const data = await res.json();
      return data.isAuthenticated;
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      
      const data = await res.json();
      return data.user || null;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    const res = await fetch('/api/auth/logout', {
      method: 'POST'
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Falha ao fazer logout");
    }
  }
}

// Instância única para uso em toda a aplicação
export const authService = new AuthService();
