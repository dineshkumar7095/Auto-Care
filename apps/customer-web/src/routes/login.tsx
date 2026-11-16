import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DEMO_ACCOUNT_BY_PORTAL } from "@automotive/api-client/fixtures";
import { LoginScreen, safeRedirect, useAuth } from "@automotive/authentication";
import { PORTAL, PORTAL_LABEL } from "@/app/config";
import { env } from "@/app/env";

type LoginSearch = { redirect?: string | undefined };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({ redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined }),
  component: LoginPage,
});

function LoginPage() {
  const auth = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuthenticated) void navigate({ to: safeRedirect(redirect, "/account") as never, replace: true });
  }, [auth.isAuthenticated, redirect, navigate]);
  return <LoginScreen portalLabel={PORTAL_LABEL} tagline="Your vehicles, orders and bookings in one place." demoPhone={env.useMocks ? DEMO_ACCOUNT_BY_PORTAL[PORTAL] : undefined} onSignedIn={() => undefined} />;
}
