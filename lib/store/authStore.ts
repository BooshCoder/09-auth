import { create } from "zustand";
import type { User } from "../../types/user";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },
  
  clearIsAuthenticated: () => {
    set({ user: null, isAuthenticated: false });
  },

  logout: async () => {
    try {
      // Викликаємо API для logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Очищаємо локальний стан
      set({ user: null, isAuthenticated: false });
    }
  },
}));
