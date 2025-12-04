import { createBrowserRouter, } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import RequireRole from "../features/auth/components/RequireRole";
import LoginPage from "../features/auth/pages/LoginPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import DashboardPage from "../features/portfolio/pages/DashboardPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import RegisterPage from "../features/auth/pages/RegisterPage";
import AnalyticsPage from "../features/portfolio/pages/AnalyticsPage";

export const router = createBrowserRouter([
  // Public
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  // Protected section WITH layout
  {
    path: "/",
    element: <AppLayout />, // Layout is public shell
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <RequireRole role="User">
              <DashboardPage />
            </RequireRole>
          </ProtectedRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <ProtectedRoute>
            <RequireRole role="Analyst">
              <AnalyticsPage />
            </RequireRole>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

