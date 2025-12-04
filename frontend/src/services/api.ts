import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL:
    (window as any).__ENV__?.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // <-- allows refresh token cookie
});

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add tracing ID
  config.headers["X-Request-ID"] = crypto.randomUUID();

  return config;
});

// Auto refresh logic
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await api.post("/auth/refresh");
        const newToken = refresh.data?.accessToken;

        useAuthStore.getState().setAuth(newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
