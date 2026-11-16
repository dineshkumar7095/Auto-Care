import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import type { AuthState } from "@automotive/authentication";
import type { Role } from "@automotive/shared-types";
import { routeTree } from "@/routeTree.gen";

const auth = (roles: Role[] | null): AuthState => ({
  portal: "customer-web",
  user: roles ? { id: "u", name: "Test", phone: "+919800000000", roles } : null,
  isAuthenticated: !!roles,
  canUsePortal: !!roles && roles.some((r) => r === "customer" || r === "b2b_buyer"),
  hasRole: () => false,
  hasAnyRole: () => false,
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

describe("customer site access", () => {
  it.each(["/", "/parts", "/parts/p-oil-filter", "/services", "/towing", "/business"])("%s is public", async (path) => {
    expect(await landAt(path, null)).toBe(path);
  });
  it("account needs sign-in", async () => expect(await landAt("/account", null)).toBe("/login"));
  it("business-only accounts can't open the customer account", async () => expect(await landAt("/account", ["seller_owner"])).toBe("/unauthorized"));
  it("customers can open their account", async () => expect(await landAt("/account", ["customer"])).toBe("/account"));
});
