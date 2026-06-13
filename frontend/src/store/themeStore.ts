import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const THEME_STORAGE_KEY = 'speedlink-theme-store';

export function applyThemeClass(theme: Theme): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const nextTheme: Theme = get().theme === 'dark' ? 'light' : 'dark';
        applyThemeClass(nextTheme);
        set({ theme: nextTheme });
      },
      setTheme: (theme: Theme) => {
        applyThemeClass(theme);
        set({ theme });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state?: ThemeState) => {
        applyThemeClass(state?.theme ?? 'light');
      },
    },
  ),
);
