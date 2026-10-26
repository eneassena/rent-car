import {
  LayoutDashboard,
  Car,
  Users,
  // FileText,
  CalendarCheck,
  // DollarSign,
  // Settings,
  LogOut,
} from 'lucide-react';

export const menuItems = [
  { label: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Veículos',    icon: Car,             path: '/veiculos'  },
  { label: 'Clientes',    icon: Users,           path: '/clientes'  },
  { label: 'Locações',    icon: CalendarCheck,   path: '/locacoes'  },
  // { label: 'Contratos',   icon: FileText,        path: '/contratos' },
  // { label: 'Financeiro',  icon: DollarSign,      path: '/financeiro'},
  // { label: 'Configurações', icon: Settings,      path: '/config'    },
];

export const footerItems = [
  { label: 'Sair', icon: LogOut, path: '/logout' },
];
