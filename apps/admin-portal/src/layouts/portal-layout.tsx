import { Outlet } from "@tanstack/react-router";
import { useAuth } from "@automotive/authentication";
import { PortalShell } from "@automotive/shared-ui/layouts/portal-shell";
import { ROLE_LABEL } from "@automotive/shared-types";
import { BUSINESS, NAV, SEARCH_PLACEHOLDER } from "@/app/navigation";
import { PORTAL_LABEL } from "@/app/config";

export function PortalLayout() {
  const auth = useAuth();
  const role = auth.user?.roles[0];
  return (
    <PortalShell
      portalLabel={PORTAL_LABEL}
      business={BUSINESS.name}
      branch={BUSINESS.branch}
      user={{ name: auth.user?.name ?? "", roleLabel: role ? (ROLE_LABEL[role] ?? role) : "" }}
      nav={NAV}
      searchPlaceholder={SEARCH_PLACEHOLDER}
      onSignOut={auth.signOut}
    >
      <Outlet />
    </PortalShell>
  );
}
