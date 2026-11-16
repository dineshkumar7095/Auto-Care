import { redirect } from "@tanstack/react-router";
import type { Permission } from "@automotive/shared-types";
import type { AuthState } from "./auth-context";

/**
 * Use in a protected layout route's `beforeLoad`. Sends signed-out users to /login (remembering where they were)
 * and signed-in users without a portal role to /unauthorized. Backend checks the same rules on every request.
 */
export function requirePortalAccess(auth: AuthState, href: string) {
  if (!auth.isAuthenticated) throw redirect({ to: "/login" as never, search: { redirect: href } as never });
  if (!auth.canUsePortal) throw redirect({ to: "/unauthorized" as never });
}

export function requirePermission(auth: AuthState, permission: Permission) {
  if (!auth.can(permission)) throw redirect({ to: "/unauthorized" as never });
}

/** Only allow same-app relative paths as post-login redirects. */
export const safeRedirect = (value: unknown, fallback = "/") =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
