import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRole?: 'CITIZEN' | 'ADMIN';
}

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard'}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
