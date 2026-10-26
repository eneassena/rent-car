import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Car as CarIcon, LogOut } from 'lucide-react';
import { menuItems } from './sidebarConfig';
import type { SidebarProps } from '@/types/layout';
import { authService } from '@/services/auth.service';

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) => {
    const navigate = useNavigate();
    const widthClass = collapsed ? 'w-20' : 'w-64';

    function handleLogout(e: React.MouseEvent) {
        e.preventDefault();
        authService.logout();
        navigate('/login', { replace: true });
    }

    return (
        <>
            {/* Overlay para mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`
          fixed lg:static top-0 left-0 z-40 h-screen
          bg-slate-900 text-slate-200
          flex flex-col
          transition-all duration-300 ease-in-out
          ${widthClass}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-brand-500 rounded-lg p-2 shrink-0">
                            <CarIcon className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <span className="font-bold text-lg text-white whitespace-nowrap">
                                RentCar
                            </span>
                        )}
                    </div>

                    {/* Botão recolher (desktop) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
                        aria-label="Recolher menu"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `
                group flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-brand-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                `
                            }
                            title={collapsed ? item.label : ''}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer (logout) */}
                <div className="border-t border-slate-800 p-2 space-y-1">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>Sair</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}


export default Sidebar