export interface UserInfo {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserInfo;
}

export interface RefreshResponse {
  access: string;
}

export interface ApiErrorShape {
  detail?: string;
  [key: string]: unknown;
}