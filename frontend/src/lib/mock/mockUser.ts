import { User, UserRole } from '@/types/user.types';

export const mockUser: User = {
  id: 'usr-001',
  email: 'chukwuemeka.obi@example.com',
  firstName: 'Chukwuemeka',
  lastName: 'Obi',
  phoneNumber: '+234 803 123 4567',
  location: 'Port Harcourt GRA, Rivers State',
  customerGroup: 'Residential',
  role: UserRole.CUSTOMER,
  avatarUrl: undefined,
};
