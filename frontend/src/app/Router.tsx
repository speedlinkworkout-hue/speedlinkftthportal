/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AuthLayout } from '../components/layout/AuthLayout';
import { UserRole } from '../types/user.types';
import { StubPage } from '../components/common/StubPage';
import { Loader2 } from 'lucide-react';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PlansPage = lazy(() => import('@/features/plans/pages/PlansPage').then(m => ({ default: m.PlansPage })));
const UsagePage = lazy(() => import('@/features/usage/pages/UsagePage').then(m => ({ default: m.UsagePage })));
const WalletPage = lazy(() => import('@/features/wallet/pages/WalletPage').then(m => ({ default: m.WalletPage })));

const AccountSettingsPage = lazy(() => import('@/features/accounts/pages/AccountSettingsPage').then(m => ({ default: m.AccountSettingsPage })));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <AuthLayout><SuspenseWrapper><LoginPage /></SuspenseWrapper></AuthLayout>,
  },
  {
    path: '/verify-otp',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]} />,
    children: [
      { path: '/dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: '/plans', element: <SuspenseWrapper><PlansPage /></SuspenseWrapper> },
      { path: '/plans/:planId', element: <SuspenseWrapper><PlansPage /></SuspenseWrapper> },
      { path: '/wallet', element: <SuspenseWrapper><WalletPage /></SuspenseWrapper> },
      { path: '/billing', element: <Navigate to="/wallet" replace /> },
      { path: '/usage', element: <SuspenseWrapper><UsagePage /></SuspenseWrapper> },

      { path: '/account/settings', element: <SuspenseWrapper><AccountSettingsPage /></SuspenseWrapper> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[UserRole.ADMIN]} />,
    children: [
      { path: '/admin', element: <StubPage title="Admin Dashboard" /> },
      { path: '/admin/customers', element: <StubPage title="Manage Customers" /> },
      { path: '/admin/plans', element: <StubPage title="Manage Plans" /> },
      { path: '/admin/activity', element: <StubPage title="Activity Log" /> },
      { path: '/admin/settings', element: <StubPage title="System Settings" /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[UserRole.FINANCE]} />,
    children: [
      { path: '/finance', element: <StubPage title="Finance Dashboard" /> },
      { path: '/finance/payments', element: <StubPage title="Payment Approvals" /> },
      { path: '/finance/wallets', element: <StubPage title="Wallet Overview" /> },
      { path: '/finance/transactions', element: <StubPage title="Transactions" /> },
      { path: '/finance/invoices', element: <StubPage title="Invoices" /> },
      { path: '/finance/reports', element: <StubPage title="Reports" /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[UserRole.SUPPORT]} />,
    children: [
      { path: '/support', element: <StubPage title="Support Dashboard" /> },
      { path: '/support/tickets', element: <StubPage title="Ticket Queue" /> },
      { path: '/support/expiring', element: <StubPage title="Expiring Plans" /> },
      { path: '/support/usage', element: <StubPage title="Usage Monitor" /> },
    ],
  },
  {
    path: '/unauthorized',
    element: <div className="p-8"><h1>403 - Unauthorized</h1></div>,
  },
  {
    path: '*',
    element: <div className="p-8"><h1>404 - Not Found</h1></div>,
  },
]);
