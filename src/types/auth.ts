export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'atendente' | 'gerente';
}

export interface AuthResponse {
  token: string;
  user: User;
}