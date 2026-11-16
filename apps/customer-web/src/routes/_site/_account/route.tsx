import { Outlet, createFileRoute } from "@tanstack/react-router";
import { requirePortalAccess } from "@automotive/authentication";

/** Account pages need a signed-in customer. */
export const Route = createFileRoute("/_site/_account")({
  beforeLoad: ({ context, location }) => requirePortalAccess(context.auth, location.href),
  component: Outlet,
});
