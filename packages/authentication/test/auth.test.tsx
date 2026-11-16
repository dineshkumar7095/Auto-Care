import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { resetMockDb } from "@automotive/api-client";
import { AuthProvider, useAuth } from "../src";
import { safeRedirect } from "../src/guards";

const wrap = (portal: "seller-portal" | "admin-portal") => ({ children }: { children: ReactNode }) => (
  <AuthProvider portal={portal} apiBaseUrl="http://x" useMocks>{children}</AuthProvider>
);

describe("authentication", () => {
  beforeEach(() => {
    resetMockDb();
    sessionStorage.clear();
  });

  it("signs a seller in and grants seller permissions only", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: wrap("seller-portal") });
    await act(async () => {
      await result.current.verifyOtp("+919800000002", "123456");
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.canUsePortal).toBe(true);
    expect(result.current.can("orders:fulfil")).toBe(true);
    expect(result.current.can("partners:approve")).toBe(false);
  });

  it("keeps portal sessions separate", async () => {
    const seller = renderHook(() => useAuth(), { wrapper: wrap("seller-portal") });
    await act(async () => {
      await seller.result.current.verifyOtp("+919800000002", "123456");
    });
    const admin = renderHook(() => useAuth(), { wrapper: wrap("admin-portal") });
    expect(admin.result.current.isAuthenticated).toBe(false);
  });

  it("only accepts same-app redirect paths", () => {
    expect(safeRedirect("/orders")).toBe("/orders");
    expect(safeRedirect("https://evil.example")).toBe("/");
    expect(safeRedirect("//evil.example")).toBe("/");
  });
});
