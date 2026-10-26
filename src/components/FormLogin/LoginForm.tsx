import { useState, type SubmitEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LoginForm = () => {
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ email, password, remember });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Erro geral */}
      {error && (
        <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* E-mail */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@rentcar.com"
            className="w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Senha */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Senha
          </label>
          <a href="/recuperar-senha" className="text-xs font-medium text-brand-600 hover:text-brand-700">
            Esqueceu a senha?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-300 rounded-lg outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Lembrar-me */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-slate-600">Lembrar de mim</span>
      </label>

      {/* Botão */}
      <button
        type="submit"
        // disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-500 text-dark text-sm font-medium rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;