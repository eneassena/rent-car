import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Veículos from '@/pages/Veículos';
import Clientes from '@/pages/Clientes';
import Locacoes from '@/pages/Locacoes';
import NotFound from '@/pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona para a página de Not Found caso a rota não exista */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Not Found */}
        <Route path="/not-found" element={<NotFound />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/veiculos" element={<Veículos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/locacoes" element={<Locacoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App
