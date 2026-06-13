import { useEffect } from 'react';
import { applyThemeClass, useThemeStore } from '@/store/themeStore';

export function ThemeInitializer(): null {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return null;
}
