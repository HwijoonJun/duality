const rawApiBaseUrl = import.meta.env.VITE_API_URL;

const normalizedApiBaseUrl =
  typeof rawApiBaseUrl === "string" ? rawApiBaseUrl.trim().replace(/\/+$/, "") : "";

export const API_BASE_URL = normalizedApiBaseUrl || "http://localhost:8000";

