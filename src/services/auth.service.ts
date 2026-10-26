import type { LoginCredentials, AuthResponse } from '@/types/auth';

const TOKEN_KEY = 'rentcar.token';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 🔌 Trocar pelo endpoint real: await api.post('/auth/login', credentials)
    // Mock temporário para desenvolvimento:
    await new Promise((r) => setTimeout(r, 800));

    if (credentials.email === 'admin@rentcar.com' && credentials.password === '123456') {
      return {
        token: 'fake-jwt-token',
        user: {
          id: '1',
          name: 'Administrador',
          email: credentials.email,
          role: 'admin',
        },
      };
    }

    throw new Error('E-mail ou senha inválidos');
  },

  saveToken(token: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};