import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useTheme() {
  const { settings, updateSettings } = useAppStore();
  const isDark = settings.theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    updateSettings({ theme: isDark ? 'light' : 'dark' });
  };

  return { isDark, toggleTheme };
}
