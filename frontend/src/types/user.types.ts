export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  SUPPORT = 'SUPPORT',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  location?: string;
  customerGroup?: 'Residential' | 'Business';
  role: UserRole;
  avatarUrl?: string;
}

export interface Account {
  id: string;
  userId: string;
  label?: string;
  accountNumber: string;
  address: string;
  status: 'ACTIVE' | 'SUSPENDED';
  ipAddress?: string;
  location?: string;
  customerGroup?: 'Residential' | 'Business';
  planStatus?: 'WAITING' | 'ACTIVE' | 'USED' | 'PAUSED';
}
