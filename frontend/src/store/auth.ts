// auth.ts
import { create } from "zustand";

export type UserRole = "User" | "Analyst" | "Admin";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  email: string;
}

interface TokenUpdate {
  accessToken: string;
  refreshToken?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  email: string | null;
  
  // For initial login/registration
  setAuth: (data: AuthData) => void;
  // For token refresh rotation
  setTokens: (data: TokenUpdate) => void; 
  // For logout/session expiry
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("pf_access"),
  refreshToken: localStorage.getItem("pf_refresh"),
  role: (localStorage.getItem("pf_role") as UserRole) ?? null,
  email: localStorage.getItem("pf_email"),

  setAuth: ({ accessToken, refreshToken, role, email }) =>
    set(() => {
      localStorage.setItem("pf_access", accessToken);
      localStorage.setItem("pf_refresh", refreshToken);
      localStorage.setItem("pf_role", role);
      localStorage.setItem("pf_email", email);
      return { accessToken, refreshToken, role, email };
    }),

  setTokens: ({ accessToken, refreshToken }) =>
    set((state) => {
      localStorage.setItem("pf_access", accessToken);
      if (refreshToken) {
        localStorage.setItem("pf_refresh", refreshToken);
      }
      return {
        ...state,
        accessToken: accessToken,
        refreshToken: refreshToken ?? state.refreshToken, // Use new refresh token if provided
      };
    }),

  clearAuth: () =>
    set(() => {
      localStorage.removeItem("pf_access");
      localStorage.removeItem("pf_refresh");
      localStorage.removeItem("pf_role");
      localStorage.removeItem("pf_email");
      return { accessToken: null, refreshToken: null, role: null, email: null };
    }),
}));