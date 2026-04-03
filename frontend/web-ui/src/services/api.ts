import { useAuthStore } from "../store/authStore";
import type { ApiErrorShape, RefreshResponse } from "../types/auth";
import { API_BASE_URL } from "./config";

const API_URL = `${API_BASE_URL}/api/v1`;

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
}
;
export class ApiError extends Error {
  status?: number;
  data?: ApiErrorShape | null;

  constructor(message: string, status?: number, data?: ApiErrorShape | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseJsonSafely<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return (await response.json()) as T;
  }

  return null;
}

async function refreshAccessToken(): Promise<string> {
  const { refreshToken, setAccessToken, clearAuth } = useAuthStore.getState();

  if (!refreshToken) {
    clearAuth();
    throw new ApiError("No refresh token available.");
  }

  const response = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  const data = await parseJsonSafely<RefreshResponse & ApiErrorShape>(response);

  if (!response.ok || !data?.access) {
    clearAuth();
    throw new ApiError(
      data?.detail || "Token refresh failed.",
      response.status,
      data
    );
  }

  setAccessToken(data.access);
  return data.access;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
  retry = true
): Promise<T> {
  const { accessToken, clearAuth } = useAuthStore.getState();

  const shouldSendBody =
    options.body !== undefined &&
    options.body !== null &&
    options.method !== "GET";

  const headers: HeadersInit = {
    ...(shouldSendBody ? { "Content-Type": "application/json" } : {}),
    ...(options.auth === false ? {} : accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: shouldSendBody
      ? typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });
  const data = await parseJsonSafely<T & ApiErrorShape>(response);

  if (response.status === 401 && retry && !path.includes("/auth/refresh/")) {
    try {
      const newAccessToken = await refreshAccessToken();

      return apiFetch<T>(
        path,
        {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          },
        },
        false
      );
    } catch (error) {
      clearAuth();
      throw error;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      (data as ApiErrorShape | null)?.detail || "Request failed.",
      response.status,
      data as ApiErrorShape | null
    );
  }

  return data as T;
}
