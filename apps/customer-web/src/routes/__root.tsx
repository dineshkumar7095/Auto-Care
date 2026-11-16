import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Button } from "@automotive/shared-ui/ui/button";
import { Toaster } from "@automotive/shared-ui/ui/sonner";
import type { RouterContext } from "@/app/router";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <p className="font-display text-6xl font-semibold text-primary">404</p>
        <p className="mt-2 text-muted-foreground">This page doesn't exist.</p>
        <Button asChild className="mt-6"><Link to="/">Go home</Link></Button>
      </div>
    </div>
  ),
});
