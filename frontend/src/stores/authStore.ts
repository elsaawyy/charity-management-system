import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/services/api";

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: "Admin" | "Staff";
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User | null) => void;
  initialized: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      initialized: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", { username, password });
          const meResponse = await api.get("/auth/me");
          set({ user: meResponse.data, isAuthenticated: true, isLoading: false, initialized: true });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } finally {
          set({ user: null, isAuthenticated: false, initialized: true });
          window.location.href = "/login";
        }
      },

      fetchMe: async () => {
        // Skip if already initialized or on public pages
        const pathname = window.location.pathname;
        if (pathname === "/" || pathname === "/login") {
          set({ initialized: true });
          return;
        }
        
        try {
          const { data } = await api.get("/auth/me");
          set({ user: data, isAuthenticated: true, initialized: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false, initialized: true });
        }
      },
    }),
    {
      name: "charity-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);