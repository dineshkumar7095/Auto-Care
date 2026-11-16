import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import type { AuthState } from "@automotive/authentication";
import { PORTAL_ROLES, type Role } from "@automotive/shared-types";
import { PORTAL } from "@/app/config";
import { NAV } from "@/app/navigation";
import { routeTree } from "@/routeTree.gen";

const auth = (roles: Role[] | null): AuthState => ({
  portal: PORTAL,
  user: roles ? { id: "u", name: "Test", phone: "+919800000000", roles } : null,
  isAuthenticated: !!roles,
  canUsePortal: !!roles && roles.some((r) => PORTAL_ROLES[PORTAL].includes(r)),
  hasRole: (r) => !!roles?.includes(r),
  hasAnyRole: (rs) => rs.some((r) => !!roles?.includes(r)),
  can: () => false,
  requestOtp: async () => ({}),
  verifyOtp: async () => { throw new Error("unused"); },
  signOut: () => undefined,
});

const landAt = async (path: string, roles: Role[] | null) => {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }), context: { queryClient: new QueryClient(), auth: auth(roles) } });
  await router.load();
  return router.state.location.pathname;
};

const navPaths = NAV.flatMap((g) => g.items.map((i) => i.to).filter((to): to is string => !!to));

describe(`${PORTAL} access control`, () => {
  it("sends signed-out visitors to the login page", async () => {
    expect(await landAt(navPaths[0]!, null)).toBe("/login");
  });

  it("blocks accounts without a role for this portal", async () => {
    const outsider: Role = PORTAL === "admin-portal" ? "seller_owner" : "customer";
    expect(await landAt(navPaths[0]!, [outsider])).toBe("/unauthorized");
  });

  it.each(navPaths)("lets a portal user open %s", async (path) => {
    expect(await landAt(path, [PORTAL_ROLES[PORTAL][0]!])).toBe(path);
  });
});
