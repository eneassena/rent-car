import type { LoginCredentials, AuthResponse } from '@/types/auth';
import api from './api.service';


const TOKEN_KEY = 'rentcar.token';


export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    this.saveToken(response.data.token, credentials.remember ? true : false);
    return response.data;
  },

  saveToken(token: string, remember: boolean) {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
    return token;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};