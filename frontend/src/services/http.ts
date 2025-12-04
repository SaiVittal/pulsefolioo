import { useAuthStore } from "../store/auth";

function getApiBaseUrl(): string {
  const win = window as Window & {
    __ENV__?: { VITE_API_BASE_URL?: string };
  };

  return (
    win.__ENV__?.VITE_API_BASE_URL ??
    import.meta.env.VITE_API_BASE_URL ??
    ""
  );
}

export async function http<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const fullUrl = getApiBaseUrl() + url;

  const res = await fetch(fullUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const message = await safeError(res);
    throw new Error(message);
  }

  return (res.json() as Promise<T>);
}

async function safeError(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "Unknown error";
  }
}
