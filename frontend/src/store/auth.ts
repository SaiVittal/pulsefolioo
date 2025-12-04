import { create } from "zustand";

export type UserRole = "User" | "Analyst" | "Admin";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;

  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    role: UserRole;
  }) => void;

  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("pf_access") ?? null,
  refreshToken: localStorage.getItem("pf_refresh") ?? null,
  role:
    (localStorage.getItem("pf_role") as UserRole | null) ?? null,

  setAuth: ({ accessToken, refreshToken, role }) => {
    localStorage.setItem("pf_access", accessToken);
    localStorage.setItem("pf_refresh", refreshToken);
    localStorage.setItem("pf_role", role);
    set({
      accessToken,
      refreshToken,
      role,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("pf_access");
    localStorage.removeItem("pf_refresh");
    localStorage.removeItem("pf_role");

    set({
      accessToken: null,
      refreshToken: null,
      role: null,
    });
  },
}));
