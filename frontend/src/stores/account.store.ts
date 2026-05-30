import { create } from 'zustand';
import { Account } from '../types/user.types';

interface AccountState {
  accounts: Account[];
  activeAccountId: string | null;
  setActiveAccount: (id: string) => void;
  setAccounts: (accounts: Account[]) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  activeAccountId: null,
  setActiveAccount: (id) => set({ activeAccountId: id }),
  setAccounts: (accounts) => set({ accounts }),
}));
