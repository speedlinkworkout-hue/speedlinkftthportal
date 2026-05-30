import { create } from 'zustand';

interface NotificationState {
  suppressExpiryAlerts: boolean;
  setSuppressExpiryAlerts: (suppress: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  suppressExpiryAlerts: false,
  setSuppressExpiryAlerts: (suppress) => set({ suppressExpiryAlerts: suppress }),
}));
