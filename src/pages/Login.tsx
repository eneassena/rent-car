import { Car } from 'lucide-react';
import LoginForm from '@/components/FormLogin/LoginForm';
import LoginBrandPanel from '@/components/FormLogin/LoginBrandPanel';

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Painel de branding (só desktop) */}
            <LoginBrandPanel />

            {/* Card de login */}
            <div className="flex items-center justify-center p-4 sm:p-8 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Logo mobile (aparece só quando o painel está oculto) */}
                    <div className="lg:hidden flex flex-col items-center mb-8">
                        <div className="bg-brand-600 text-white p-3 rounded-xl mb-3">
                            <Car className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">RentCar</h1>
                    </div>

                    {/* Card branco */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Acesse sua conta</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Entre com suas credenciais para continuar
                            </p>
                        </div>

                        {/* Formulário */}
                        <LoginForm />

                        {/* Divisor */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 border-t border-slate-200" />
                            <span className="text-xs text-slate-500">ou</span>
                            <div className="flex-1 border-t border-slate-200" />
                        </div>

                        {/* Cadastro */}
                        <p className="text-center text-sm text-slate-500">
                            Não tem conta?{' '}
                            <a href="/cadastro" className="font-medium text-brand-600 hover:text-brand-700">
                                Criar conta
                            </a>
                        </p>
                    </div>

                    {/* Rodapé mobile */}
                    <p className="text-center text-xs text-slate-400 mt-6 lg:hidden">
                        © 2026 RentCar · Todos os direitos reservados
                    </p>
                </div>
            </div>
        </div>
    );
}