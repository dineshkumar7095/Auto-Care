import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@automotive/shared-ui/ui/sonner";
import { Button } from "@automotive/shared-ui/ui/button";
import type { RouterContext } from "@/app/router";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <p className="font-display text-6xl font-semibold text-primary">404</p>
        <p className="mt-2 text-muted-foreground">This page doesn't exist.</p>
        <Button asChild className="mt-6">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
