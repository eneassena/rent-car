import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import DashboardLayout from './DashboardLayout';

export function ProtectedRoute() {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}