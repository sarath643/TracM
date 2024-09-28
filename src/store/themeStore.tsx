import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: true,
      setIsDarkMode: (isDarkMode: boolean) => set({ isDarkMode }),
    }),
    {
      name: 'dark-mode',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
