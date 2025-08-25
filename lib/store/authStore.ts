import { create } from "zustand";
import type { User } from "../../types/user";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Очищаємо старі дані при ініціалізації
  if (typeof window !== 'undefined') {
    console.log('Clearing old auth data from localStorage');
    localStorage.removeItem('auth-store');
    localStorage.removeItem('08-zustand');
  }

  return {
    user: null,
    isAuthenticated: false,
    
    setUser: (user) => {
      console.log('Setting user:', user);
      set({ user, isAuthenticated: !!user });
    },
    
    clearIsAuthenticated: () => {
      console.log('Clearing authentication');
      set({ user: null, isAuthenticated: false });
    },

    logout: async () => {
      try {
        console.log('Logging out...');
        // Викликаємо API для logout
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Очищаємо локальний стан
        console.log('Clearing local state after logout');
        set({ user: null, isAuthenticated: false });
      }
    },
  };
});
