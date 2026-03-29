export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshResponse {
  access: string;
}

export interface ApiErrorShape {
  detail?: string;
  [key: string]: unknown;
}