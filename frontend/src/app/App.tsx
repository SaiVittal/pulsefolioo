import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./providers";
import { router } from "./router";
import ErrorBoundary from "../components/Errorboundary";

export default function App() {
  return (
    <ErrorBoundary>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
    </ErrorBoundary>
  );
}
