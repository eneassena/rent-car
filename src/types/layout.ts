import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

export interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface HeaderProps {
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
}
