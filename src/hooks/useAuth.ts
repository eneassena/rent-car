import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { LoginCredentials } from '@/types/auth';

export function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(credentials: LoginCredentials) {
    setLoading(true);
    setError(null);

    try {
      const { token } = await authService.login(credentials);
      authService.saveToken(token, !!credentials.remember);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}