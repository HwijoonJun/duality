const rawApiBaseUrl = import.meta.env.VITE_API_URL;

const normalizedApiBaseUrl =
  typeof rawApiBaseUrl === "string" ? rawApiBaseUrl.trim().replace(/\/+$/, "") : "";

// In production behind reverse proxy, use same-origin by default.
export const API_BASE_URL =
  normalizedApiBaseUrl || (import.meta.env.DEV ? "http://localhost:8000" : "");
