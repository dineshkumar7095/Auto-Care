import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import type { AuthState } from "@automotive/authentication";
import { routeTree } from "@/routeTree.gen";

export type RouterContext = { queryClient: QueryClient; auth: AuthState };

export const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });

export const router = createRouter({
  routeTree,
  // `auth` is provided at render time by <RouterProvider context={{ auth }} />.
  context: { queryClient, auth: undefined! },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
