import ClientDetails from "@/features/clients/pages/ClientDetails";
import ClientCreate from "@/features/clients/pages/ClientCreate";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import Locacoes from "@/features/rentals/pages/Locacoes";
import Login from "@/features/auth/pages/Login";
import NotFound from "@/features/pages-default/not-found/NotFound";
import { PageEditVeiculo } from "@/features/vehicles/pages/edit";
import { PageRegistreVeiculo } from "@/features/vehicles/pages/registre";
import Veículos from "@/features/vehicles/pages/Veículos";
import ProtectedRoute from "@/shared/layout/Auth";
import { Routes, Route, Navigate } from "react-router-dom";
import ClientList from "@/features/clients/pages/ClientList";

const AppRoutes = () => {
    return (
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
                <Route path="/veiculos" element={<Veículos />} />
                <Route path="/veiculos/edit/:id" element={<PageEditVeiculo />} />
                <Route path="/veiculos/registre" element={<PageRegistreVeiculo />} />

                {/* Rotas de clientes */}
                <Route path="/clientes" element={<ClientList />} />
                <Route path="/clientes/edit/:id" element={<ClientDetails />} />
                <Route path="/clientes/details/:id" element={<ClientDetails />} />
                <Route path="/clientes/novo" element={<ClientCreate />} />

                {/* Rotas de locações */}
                <Route path="/locacoes" element={<Locacoes />} />
                <Route path="/locacoes/edit/:id" element={<Locacoes />} />
                <Route path="/locacoes/registre" element={<Locacoes />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
