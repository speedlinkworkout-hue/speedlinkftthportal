import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/user.types';
import { AppShell } from './AppShell';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, user } = useAuthStore();
  const resolvedRole = user?.role ?? role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!resolvedRole || !allowedRoles.includes(resolvedRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
