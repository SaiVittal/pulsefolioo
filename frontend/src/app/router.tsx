import { Suspense } from "react";
import { LoaderSuspense } from "../components/ui/LoaderSuspense";
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import UnauthorizedPage from "../features/auth/pages/UnauthorizedPage";
import AnalyticsPage from "../features/portfolio/pages/AnalyticsPage";
import DashboardPage from "../features/portfolio/pages/DashboardPage";
import MarketPage from "../features/portfolio/pages/MarketPage";
import TransactionsPage from "../features/portfolio/pages/TransactionsPage";
import SettingsPage from "../features/portfolio/pages/SettingsPage";
import WatchlistPage from "../features/watchlist/pages/WatchlistPage";

import { AppLayout } from "../layouts";
import ProtectedRoute from "../routes/ProtectedRoute";
import RequireRole from "../routes/RequireRole";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoaderSuspense />}>
            <ProtectedRoute>
              <RequireRole role="User">
                <DashboardPage />
              </RequireRole>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "market",
        element: (
          <Suspense fallback={<LoaderSuspense />}>
            <ProtectedRoute>
              <RequireRole role="User">
                <MarketPage />
              </RequireRole>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "analytics",
        element: (
          <Suspense fallback={<LoaderSuspense />}>
            <ProtectedRoute>
              <RequireRole role="Analyst">
                <AnalyticsPage />
              </RequireRole>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "watchlist",
        element: (
          <Suspense fallback={<LoaderSuspense />}>
            <ProtectedRoute>
              <RequireRole role="User">
                <WatchlistPage />
              </RequireRole>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "transactions",
        element: (
          <Suspense fallback={<LoaderSuspense />}>
            <ProtectedRoute>
              <RequireRole role="User">
                <TransactionsPage />
              </RequireRole>
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<LoaderSuspense />}>
            <ProtectedRoute>
              <RequireRole role="User">
                <SettingsPage />
              </RequireRole>
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },
]);
