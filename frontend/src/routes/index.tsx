import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import DashboardPage from "../features/portfolio/pages/DashboardPage";
import AnalyticsPage from "../features/portfolio/pages/AnalyticsPage";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import RequireRole from "./RequireRole";

export const router = createBrowserRouter([
  // Public
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // Protected + Layout
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),

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
        path: "analytics",
        element: (
          <RequireRole role="Analyst">
            <AnalyticsPage />
          </RequireRole>
        ),
      },
    ],
  },
]);
