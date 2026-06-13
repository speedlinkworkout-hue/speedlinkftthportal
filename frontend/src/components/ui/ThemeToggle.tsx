import type { ReactElement } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeToggle(): ReactElement {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      {isDark ? (
        <Moon
          key="moon"
          className="h-5 w-5 transition-all duration-200 ease-out"
          aria-hidden="true"
        />
      ) : (
        <Sun
          key="sun"
          className="h-5 w-5 transition-all duration-200 ease-out"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
