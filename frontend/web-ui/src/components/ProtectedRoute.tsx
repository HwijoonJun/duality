// This route wrapper blocks access to protected pages unless the user has auth state.
import type { JSX } from "react/jsx-runtime";
import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute(): JSX.Element {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const isAuthenticated = Boolean(accessToken || refreshToken);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}