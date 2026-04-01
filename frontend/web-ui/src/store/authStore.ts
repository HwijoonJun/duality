import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/auth";

// helper function to update or clear the auth state
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (payload: {
    access: string;
    refresh: string;
    user: User;
  }) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setAuth: ({ access, refresh, user }) =>
        set({
          accessToken: access,
          refreshToken: refresh,
          user,
        }),

      setAccessToken: (accessToken) =>
        set({
          accessToken,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);