import { Account } from '@/types/user.types';

export const mockAccounts: Account[] = [
  {
    id: 'acc-001',
    userId: 'usr-001',
    label: 'Home',
    accountNumber: 'SL-20240001',
    address: 'Home — Port Harcourt GRA',
    status: 'ACTIVE',
    ipAddress: '102.89.12.44',
    location: 'Port Harcourt GRA',
    customerGroup: 'Residential',
    planStatus: 'ACTIVE',
  },
  {
    id: 'acc-002',
    userId: 'usr-001',
    label: 'Office',
    accountNumber: 'SL-20240042',
    address: 'Office — Trans Amadi',
    status: 'ACTIVE',
    ipAddress: '102.89.12.47',
    location: 'Trans Amadi',
    customerGroup: 'Business',
    planStatus: 'WAITING',
  },
];

export const defaultAccountId = 'acc-001';
