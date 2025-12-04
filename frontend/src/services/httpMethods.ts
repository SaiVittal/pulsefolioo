import { http } from "./http";

export const apiGet = <T>(url: string) =>
  http<T>(url, { method: "GET" });

export const apiPost = <T>(url: string, body: unknown) =>
  http<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPut = <T>(url: string, body: unknown) =>
  http<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const apiDelete = <T>(url: string) =>
  http<T>(url, {
    method: "DELETE",
  });
