import { beforeEach, describe, expect, it } from "vitest";
import { ApiError, api, configureApiClient, resetMockDb } from "../src";

let token: string | null = null;
configureApiClient({ useMocks: true, getToken: () => token });

const signIn = async (portal: "seller-portal" | "admin-portal" | "customer-web", phone: string) => {
  const s = await api.auth.verifyOtp({ phone, code: "123456", portal });
  token = s.accessToken;
  return s;
};

describe("mock API contract", () => {
  beforeEach(() => {
    resetMockDb();
    token = null;
  });

  it("rejects a wrong OTP", async () => {
    await expect(api.auth.verifyOtp({ phone: "+919800000002", code: "000000", portal: "seller-portal" })).rejects.toBeInstanceOf(ApiError);
  });

  it("blocks a customer account from the seller portal", async () => {
    await expect(signIn("seller-portal", "+919800000001")).rejects.toMatchObject({ code: "portal_forbidden" });
  });

  it("lets a seller accept a new order but not skip to dispatched", async () => {
    await signIn("seller-portal", "+919800000002");
    const accepted = await api.orders.updateStatus("o-24811", "accepted");
    expect(accepted.status).toBe("accepted");
    await expect(api.orders.updateStatus("o-24807", "dispatched")).rejects.toMatchObject({ code: "invalid_transition" });
  });

  it("won't approve a partner with unverified documents", async () => {
    await signIn("admin-portal", "+919800000004");
    await expect(api.vendors.decide("ven-dent-shine", { decision: "approve" })).rejects.toMatchObject({ code: "documents_missing" });
    const ok = await api.vendors.decide("ven-autohub", { decision: "approve" });
    expect(ok.status).toBe("approved");
  });

  it("only lists EV-qualified workshops for EV diagnostics", async () => {
    const list = await api.bookings.listWorkshops({ service: "EV diagnostics" });
    expect(list.every((w) => w.evQualified)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });
});

describe("demo sessions", () => {
  it("stay signed in after a page reload resets the demo data", async () => {
    const { handleMockRequest } = await import("../src/mock/server");
    const verify = await handleMockRequest<{ accessToken: string }>("POST", "/auth/otp/verify", { phone: "+919800000002", code: "123456", portal: "seller-portal" }, null);
    expect(verify.status).toBe(200);
    const token = verify.payload.ok ? verify.payload.data.accessToken : "";
    resetMockDb();
    const me = await handleMockRequest("GET", "/auth/me", undefined, token);
    expect(me.status).toBe(200);
  });
  it("rejects a made-up token", async () => {
    const { handleMockRequest } = await import("../src/mock/server");
    expect((await handleMockRequest("GET", "/auth/me", undefined, "mock.nobody.1")).status).toBe(401);
  });
});
