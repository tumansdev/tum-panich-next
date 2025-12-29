import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Get API URL at runtime to avoid import.meta.env issues
const getApiUrl = () => (typeof window !== 'undefined' ? (window as unknown as { __API_URL__?: string }).__API_URL__ : '') || 'https://tumpanich.com';

interface User {
  id: number;
  username: string;
  displayName: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
      error: null,

      login: async (username: string, password: string): Promise<boolean> => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch(`${getApiUrl()}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ loading: false, error: data.error || 'เข้าสู่ระบบไม่สำเร็จ' });
            return false;
          }

          set({
            isAuthenticated: true,
            token: data.token,
            user: data.user,
            loading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({
            loading: false,
            error: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
          });
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          error: null,
        });
      },

      checkAuth: async (): Promise<boolean> => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        try {
          const response = await fetch(`${getApiUrl()}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            set({ isAuthenticated: false, token: null, user: null });
            return false;
          }

          const user = await response.json();
          set({ isAuthenticated: true, user });
          return true;
        } catch {
          set({ isAuthenticated: false, token: null, user: null });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'tum-admin-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Export token getter for use in API calls
export const getAuthToken = (): string | null => {
  return useAuthStore.getState().token;
};
