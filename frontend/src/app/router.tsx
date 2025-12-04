import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import RequireRole from "../components/auth/RequireRole";
import LoginPage from "../features/auth/pages/LoginPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import DashboardPage from "../features/portfolio/pages/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <RequireRole role="User">
            <DashboardPage />
          </RequireRole>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireRole role="Admin">
            <div>Admin Panel</div>
          </RequireRole>
        ),
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "*", element: <Navigate to="/" /> },
]);
