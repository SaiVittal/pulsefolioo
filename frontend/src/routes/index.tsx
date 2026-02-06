import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import DashboardPage from "../features/portfolio/pages/DashboardPage";
import AnalyticsPage from "../features/portfolio/pages/AnalyticsPage";
import WatchlistPage from "../features/watchlist/pages/WatchlistPage";
import MarketPage from "../features/portfolio/pages/MarketPage";
import TransactionsPage from "../features/portfolio/pages/TransactionsPage";
import SettingsPage from "../features/portfolio/pages/SettingsPage";

import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import RequireRole from "./RequireRole";
import RegisterPage from "../features/auth/pages/RegisterPage";
import RouterErrorPage from "../components/RouterErrorPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouterErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <RouterErrorPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
    errorElement: <RouterErrorPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouterErrorPage />,
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
        path: "market",
        element: (
          <RequireRole role="User">
            <MarketPage />
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
      {
        path: "watchlist",
        element: (
          <RequireRole role="User">
            <WatchlistPage />
          </RequireRole>
        ),
      },
      {
        path: "transactions",
        element: (
          <RequireRole role="User">
            <TransactionsPage />
          </RequireRole>
        ),
      },
      {
        path: "settings",
        element: (
          <RequireRole role="User">
            <SettingsPage />
          </RequireRole>
        ),
      },
    ]
  }
]);

