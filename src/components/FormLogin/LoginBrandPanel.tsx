import { Car, TrendingUp, Users } from 'lucide-react';

const LoginBrandPanel = () => {
  const highlights = [
    { icon: Car, label: '24 veículos na frota' },
    { icon: TrendingUp, label: '12 locações ativas' },
    { icon: Users, label: '89 clientes cadastrados' },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 bg-gradient-to-br from-brand-700 to-brand-900 text-dark">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-white/10 backdrop-blur p-2.5 rounded-xl">
          <Car className="w-7 h-7" />
        </div>
        <span className="text-2xl font-bold">RentCar</span>
      </div>

      {/* Texto principal */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold leading-tight">
          Gerencie sua frota <br />
          em um só lugar.
        </h1>
        <p className="text-lg text-gray-500 max-w-md">
          Controle veículos, locações, clientes e financeiro com uma
          plataforma feita para locadoras modernas.
        </p>
      </div>

      {/* Destaques */}
      <div className="space-y-3">
        {highlights.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black/10 backdrop-blur flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm text-black/90">{label}</span>
          </div>
        ))}
      </div>

      {/* Rodapé */}
      <p className="text-xs text-black/50">
        © 2026 RentCar · Todos os direitos reservados
      </p>
    </div>
  );
};

export default LoginBrandPanel;