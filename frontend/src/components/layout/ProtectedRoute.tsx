import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/user.types';
import { AppShell } from './AppShell';
import { authService } from '@/services/auth.service';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role, user, logout } = useAuthStore();
  const resolvedRole = user?.role ?? role;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: authService.me,
    enabled: isAuthenticated,
    retry: false,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    logout();
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
