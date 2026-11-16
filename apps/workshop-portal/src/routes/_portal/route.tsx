import { createFileRoute } from "@tanstack/react-router";
import { requirePortalAccess } from "@automotive/authentication";
import { PortalLayout } from "@/layouts/portal-layout";

/** Everything under this pathless layout requires a signed-in user with a role for this portal. */
export const Route = createFileRoute("/_portal")({
  beforeLoad: ({ context, location }) => requirePortalAccess(context.auth, location.href),
  component: PortalLayout,
});
