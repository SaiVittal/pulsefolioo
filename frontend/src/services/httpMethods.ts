import { apiClient } from "./apiClient";

export const apiGet = <T>(url: string) =>
  apiClient.get<T>(url).then(r => r.data);

export const apiPost = <T>(url: string, body: unknown) =>
  apiClient.post<T>(url, body).then(r => r.data);

export const apiPut = <T>(url: string, body: unknown) =>
  apiClient.put<T>(url, body).then(r => r.data);

export const apiDelete = <T>(url: string) =>
  apiClient.delete<T>(url).then(r => r.data);
