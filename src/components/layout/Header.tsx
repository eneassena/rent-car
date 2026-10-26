import { Menu, Bell, Search } from 'lucide-react';

type HeaderProps = {
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ setMobileOpen }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Botão menu mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        {/* Busca */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-80">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar veículo, cliente..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Ações direita */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-slate-100">
          <Bell className="w-5 h-5 text-slate-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold text-sm">
            RC
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Admin</p>
            <p className="text-xs text-slate-500">admin@rentcar.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}