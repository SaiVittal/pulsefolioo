import { create } from "zustand";

export type UserRole = "User" | "Analyst" | "Admin";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  email: string | null;
  setAuth: (data: { accessToken: string; refreshToken: string; role: UserRole, email: string }) => void;
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

  clearAuth: () =>
    set(() => {
      localStorage.removeItem("pf_access");
      localStorage.removeItem("pf_refresh");
      localStorage.removeItem("pf_role");
      return { accessToken: null, refreshToken: null, role: null };
    }),
}));
