import {
  LayoutDashboard,
  Users,
  CarFront,
  ClipboardList,
  LogOut,
} from "lucide-react";

export const menuItems = [
  { 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    path: "/dashboard" 
  },
  { 
    
    label: "Veículos", 
    path: "/veiculos",
    icon: CarFront
  },
  { 
    label: "Clientes", 
    path: "/clientes" ,
    icon: Users
  },
  { 
    label: "Locações", 
    path: "/locacoes",
    icon: ClipboardList 
  },
 ];

export const footerItems = [{ label: "Sair", icon: LogOut, path: "/logout" }];
