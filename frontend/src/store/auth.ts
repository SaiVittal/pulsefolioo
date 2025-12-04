import { create } from "zustand";

export type Role = "User" | "Analyst" | "Admin" | null;

interface AuthState {
  accessToken: string | null;          
  role: Role;                          
  setAuth: (accessToken: string | null, role?: Role) => void;
  logout: () => void;
}

const ROLE_KEY = "pf_role";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  role: (localStorage.getItem(ROLE_KEY) as Role) ?? null,

  setAuth: (accessToken, role) => {
    if (role) {
      localStorage.setItem(ROLE_KEY, role);
    } else {
      localStorage.removeItem(ROLE_KEY);
    }
    set({ accessToken, role: role ?? null });
  },

  logout: () => {
    localStorage.removeItem(ROLE_KEY);
    set({ accessToken: null, role: null });
  },
}));
