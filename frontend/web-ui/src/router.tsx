
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/login/LoginPage";
import UserManagementPage from "./pages/user_management/components/UserManagementPage";
import HomePage from "./pages/HomePages/HomePage";
import SignupPage from "./pages/login/SignupPage";
import Profile from "./components/User/profile.component";
import BoardUser from "./components/Home/board-user.component";
import BoardAdmin from "./components/Home/board-moderator.component";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/profile",
    element: <Profile />, 
  },
  {
    path: "/user",
    element: <BoardUser />,
  },
  {
    path: "/admin",
    element: <BoardAdmin />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/account",
        element: <UserManagementPage />,
      },
    ],
  },
  {
    path: "/*",
    element: <Navigate to="/account" replace />,
  },

]);

export default router;
