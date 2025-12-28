import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  pin: string;
  login: (pin: string) => boolean;
  logout: () => void;
}

// Default PIN: 1234 (can be changed later)
const CORRECT_PIN = '1234';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      pin: CORRECT_PIN,

      login: (inputPin: string) => {
        if (inputPin === CORRECT_PIN) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'tum-admin-auth',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);
