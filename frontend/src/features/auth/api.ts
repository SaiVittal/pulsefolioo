import { http } from "../../services/http";

export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export async function loginApi(body: LoginRequest): Promise<LoginResponse> {
  // POST /auth/login -> returns { accessToken, role } and sets refresh cookie
  return http<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function refreshApi(): Promise<LoginResponse> {
  // POST /auth/refresh -> reads HttpOnly cookie and returns new access token + role
  return http<LoginResponse>("/auth/refresh", {
    method: "POST",
  });
}

export async function logoutApi(): Promise<void> {
  // POST /auth/logout -> server clears refresh cookie
  await http<void>("/auth/logout", { method: "POST" });
}
