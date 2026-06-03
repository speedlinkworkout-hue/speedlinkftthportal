import { User, UserRole } from '@/types/user.types';

export interface AccessProfile {
  role: UserRole;
  email: string;
  title: string;
  subtitle: string;
  landingPath: string;
  features: string[];
}

export const accessProfiles: AccessProfile[] = [
  {
    role: UserRole.CUSTOMER,
    email: 'customer@gmail.com',
    title: 'Customer',
    subtitle: 'Customer portal access',
    landingPath: '/dashboard',
    features: ['Dashboard', 'Plans', 'Wallet & Billing', 'Usage'],
  },
  {
    role: UserRole.FINANCE,
    email: 'finance@gmail.com',
    title: 'Finance',
    subtitle: 'Billing and payment operations',
    landingPath: '/finance',
    features: ['Finance Dashboard', 'Payment Approvals', 'Wallet Overview', 'Transactions', 'Invoices', 'Reports'],
  },
  {
    role: UserRole.SUPPORT,
    email: 'technical@gmail.com',
    title: 'Technical Support',
    subtitle: 'Operational support and monitoring',
    landingPath: '/support',
    features: ['Support Dashboard', 'Expiring Plans', 'Usage Monitor'],
  },
  {
    role: UserRole.ADMIN,
    email: 'speedadmin@gmail.com',
    title: 'Admin',
    subtitle: 'Platform administration and governance',
    landingPath: '/admin',
    features: ['Admin Dashboard', 'Manage Customers', 'Manage Plans', 'Activity Log', 'System Settings'],
  },
];

export function getAccessProfileByEmail(email: string): AccessProfile | null {
  const normalizedEmail = email.trim().toLowerCase();
  return accessProfiles.find((profile) => profile.email.toLowerCase() === normalizedEmail) ?? null;
}

export function resolveUserRoleFromEmail(email: string, fallback: UserRole = UserRole.CUSTOMER): UserRole {
  return getAccessProfileByEmail(email)?.role ?? fallback;
}

export function getRoleLandingPath(role: UserRole): string {
  return accessProfiles.find((profile) => profile.role === role)?.landingPath ?? '/dashboard';
}

export function buildLoginUser(email: string): User | null {
  const profile = getAccessProfileByEmail(email);
  if (!profile) {
    return null;
  }

  const nameMap: Record<UserRole, { firstName: string; lastName: string; group: 'Residential' | 'Business' }> = {
    [UserRole.CUSTOMER]: { firstName: 'Customer', lastName: 'User', group: 'Residential' },
    [UserRole.FINANCE]: { firstName: 'Finance', lastName: 'Team', group: 'Business' },
    [UserRole.SUPPORT]: { firstName: 'Technical', lastName: 'Support', group: 'Business' },
    [UserRole.ADMIN]: { firstName: 'Admin', lastName: 'User', group: 'Business' },
  };

  const name = nameMap[profile.role];

  return {
    id: `usr-${profile.role.toLowerCase()}`,
    email: profile.email,
    firstName: name.firstName,
    lastName: name.lastName,
    customerGroup: name.group,
    role: profile.role,
  };
}

export function isEmailAllowedForRole(email: string, role: UserRole): boolean {
  return resolveUserRoleFromEmail(email, role) === role;
}
