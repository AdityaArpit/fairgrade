import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingState from './LoadingState.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

function roleHome(role) {
  return role === 'teacher' ? '/teacher' : '/student';
}

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <LoadingState label="Checking session" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return <Outlet />;
}
