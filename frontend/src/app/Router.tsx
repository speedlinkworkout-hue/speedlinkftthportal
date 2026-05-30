import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AuthLayout } from '../components/layout/AuthLayout';
import { UserRole } from '../types/user.types';
import { StubPage } from '../components/common/StubPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { PlansPage } from '@/features/plans/pages/PlansPage';
import { UsagePage } from '@/features/usage/pages/UsagePage';
import { WalletPage } from '@/features/wallet/pages/WalletPage';
import { TicketsPage } from '@/features/tickets/pages/TicketsPage';
import { NewTicketPage } from '@/features/tickets/pages/NewTicketPage';
import { TicketDetailPage } from '@/features/tickets/pages/TicketDetailPage';
import { AccountSettingsPage } from '@/features/accounts/pages/AccountSettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <AuthLayout><LoginPage /></AuthLayout>,
  },
  {
    path: '/verify-otp',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]} />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/plans', element: <PlansPage /> },
      { path: '/plans/:planId', element: <PlansPage /> },
      { path: '/wallet', element: <WalletPage /> },
      { path: '/billing', element: <Navigate to="/wallet" replace /> },
      { path: '/usage', element: <UsagePage /> },
      { path: '/tickets', element: <TicketsPage /> },
      { path: '/tickets/new', element: <NewTicketPage /> },
      { path: '/tickets/:ticketId', element: <TicketDetailPage /> },
      { path: '/account/settings', element: <AccountSettingsPage /> },
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
