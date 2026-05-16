import { create } from 'zustand';
import { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  logout: () => void;
}

const getInitialDarkMode = (): boolean => {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    return saved === 'true';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useAuthStore = create<AuthState>((set) => {
  const initialDarkMode = getInitialDarkMode();
  if (initialDarkMode) {
    document.documentElement.classList.add('dark');
  }

  return {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isDarkMode: initialDarkMode,

    setUser: (user) => {
      set({ user });
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },

    setAccessToken: (token) => {
      set({ accessToken: token });
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    },

    setAuthenticated: (authenticated) => {
      set({ isAuthenticated: authenticated });
    },

    toggleDarkMode: () => {
      set((state) => {
        const newDarkMode = !state.isDarkMode;
        localStorage.setItem('darkMode', String(newDarkMode));
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newDarkMode };
      });
    },

    setDarkMode: (isDark) => {
      set({ isDarkMode: isDark });
      localStorage.setItem('darkMode', String(isDark));
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    logout: () => {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
  };
});
