import { create } from 'zustand';
import { User, UserRole } from '../types/user.types';
import { resolveUserRoleFromEmail } from '@/lib/auth/access-control';

interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  login: (user, token) =>
    set({
      user: { ...user, role: resolveUserRoleFromEmail(user.email, user.role) },
      token,
      role: resolveUserRoleFromEmail(user.email, user.role),
      isAuthenticated: true,
    }),
  logout: () =>
    set({ user: null, token: null, role: null, isAuthenticated: false }),
}));
