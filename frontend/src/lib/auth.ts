import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiClient, tokenStorage } from './api';
import type { AuthResponse, LoginCredentials, User, UserRole } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await ApiClient.post<AuthResponse>('/auth/login/', credentials);
          tokenStorage.setTokens(response.access, response.refresh);
          set({
            user: response.user,
            token: response.access,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        try {
          const refresh = tokenStorage.getRefresh();
          if (refresh) {
            await ApiClient.post('/auth/logout/', { refresh }).catch(() => undefined);
          }
        } finally {
          tokenStorage.clear();
          set({ user: null, token: null });
        }
      },

      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const user = await ApiClient.get<User>('/auth/me/');
          set({ user, isLoading: false });
        } catch (err) {
          set({ user: null, isLoading: false });
          throw err;
        }
      },

      hasRole: (...roles) => {
        const { user } = get();
        return user ? roles.includes(user.role) : false;
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'rops-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  CHEF: 'Chef',
  STAFF: 'Staff',
  AUDITOR: 'Auditor',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  CHEF: 'bg-amber-100 text-amber-800',
  STAFF: 'bg-emerald-100 text-emerald-800',
  AUDITOR: 'bg-rose-100 text-rose-800',
};
