import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@automotive/authentication";
import { PORTAL } from "@/app/config";
import { env } from "@/app/env";
import { queryClient, router } from "@/app/router";
import "./styles.css";

function App() {
  const auth = useAuth();
  // Re-run route guards whenever the session changes (sign in / sign out).
  useEffect(() => {
    if (!auth.isAuthenticated) queryClient.clear();
    void router.invalidate();
  }, [auth.isAuthenticated]);
  return <RouterProvider router={router} context={{ auth }} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider portal={PORTAL} apiBaseUrl={env.apiUrl} useMocks={env.useMocks}>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
