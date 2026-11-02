import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import MainLayout from '@/shared/layout/MainLayout';

const ProtectedRoute = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
export default ProtectedRoute;