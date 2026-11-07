import { Routes, Route, Navigate } from "react-router-dom";

// Rotas de autenticação e páginas padrão
import Dashboard from "@/features/dashboard/pages/Dashboard";
import Login from "@/features/auth/pages/Login";
import NotFound from "@/features/pages-default/not-found/NotFound";
import ProtectedRoute from "@/shared/layout/Auth";


// Rotas de clientes
import ClientDetails from "@/features/clients/pages/ClientDetails";
import ClientCreate from "@/features/clients/pages/ClientCreate";
import ClientEdit from "@/features/clients/pages/ClientEdit";
import ClientList from "@/features/clients/pages/ClientList";


// Rotas de locações
import RentalsList from "@/features/rentals/pages/RentalsList";
import RentalsDetails from "@/features/rentals/pages/RentalsDetails";
import RentalsEdit from "@/features/rentals/pages/RentalsEdit";
import RentalsCreate from "@/features/rentals/pages/RentalsCreate";


// Rotas de veículos
import VehiclesList from "@/features/vehicles/pages/VehiclesList";
import VehiclesDetails from "@/features/vehicles/pages/VehiclesDetails";
import VehiclesEdit from "@/features/vehicles/pages/VehiclesEdit";
import VehiclesCreate from "@/features/vehicles/pages/VehiclesCreate";


const AppRoutes = () => (
    <Routes>
        {/* Redireciona para a página de Not Found caso a rota não exista */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Not Found */}
        <Route path="/not-found" element={<NotFound />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
            {/* Rotas de dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Rotas de veículos */}
            <Route path="/veiculos" element={<VehiclesList />} />
            <Route path="/veiculos/:id" element={<VehiclesDetails />} />
            <Route path="/veiculos/:id/editar" element={<VehiclesEdit />} />
            <Route path="/veiculos/novo" element={<VehiclesCreate />} />

            {/* Rotas de clientes */}
            <Route path="/clientes" element={<ClientList />} />
            <Route path="/clientes/:id" element={<ClientDetails />} />
            <Route path="/clientes/:id/editar" element={<ClientEdit />} />
            <Route path="/clientes/novo" element={<ClientCreate />} />

            {/* Rotas de locações */}
            <Route path="/locacoes" element={<RentalsList />} />
            <Route path="/locacoes/:id" element={<RentalsDetails />} />
            <Route path="/locacoes/:id/editar" element={<RentalsEdit />} />
            <Route path="/locacoes/novo" element={<RentalsCreate />} />
        </Route>
    </Routes>
)

export default AppRoutes;
