import { apiPost } from "../../services/httpMethods";
import { UserRole } from "../../store/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  role: UserRole;
}

export async function loginApi(body: LoginRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/api/auth/login", body);
}

export async function registerApi(body: RegisterRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/api/auth/register", body);
}

export async function refreshApi(refreshToken: string): Promise<AuthResponse> {
  return apiPost<AuthResponse>("/api/auth/refresh", refreshToken);
}

export async function logoutApi(): Promise<void> {
  // Client-side logout - just clear local storage
}

