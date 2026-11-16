import type { ReactNode } from "react";
import type { Permission } from "@automotive/shared-types";
import { useAuth } from "./auth-context";

/** Hide a control the user isn't allowed to use. The API still enforces the rule. */
export function Can({ permission, children, fallback = null }: { permission: Permission; children: ReactNode; fallback?: ReactNode }) {
  return <>{useAuth().can(permission) ? children : fallback}</>;
}
