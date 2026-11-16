import { beforeEach, describe, expect, it } from "vitest";
import type { PortalId } from "@automotive/shared-types";
import { api, configureApiClient, resetMockDb } from "../src";

let token: string | null = null;
configureApiClient({ useMocks: true, getToken: () => token });
const signIn = async (portal: PortalId, phone: string) => {
  token = (await api.auth.verifyOtp({ phone, code: "123456", portal })).accessToken;
};
const CUSTOMER = "+919800000001", SELLER = "+919800000002", ADMIN = "+919800000004", DISTRIBUTOR = "+919800000005", TOWING = "+919800000006";

describe("returns & refunds", () => {
  beforeEach(() => { resetMockDb(); token = null; });
  it("customer returns a delivered order, seller approves, finance refunds", async () => {
    await signIn("customer-web", CUSTOMER);
    const r = await api.returns.request({ orderId: "o-24702", reason: "does_not_fit" });
    expect(r.status).toBe("requested");
    await signIn("seller-portal", SELLER);
    await expect(api.returns.decide(r.id, "refund")).rejects.toMatchObject({ code: "forbidden" });
    expect((await api.returns.decide(r.id, "approve")).status).toBe("approved");
    await signIn("admin-portal", ADMIN);
    expect((await api.returns.decide(r.id, "refund")).status).toBe("refunded");
  });
  it("won't return an order that isn't delivered", async () => {
    await signIn("customer-web", CUSTOMER);
    await expect(api.returns.request({ orderId: "o-24811", reason: "not_needed" })).rejects.toMatchObject({ code: "return_not_allowed" });
  });
});

describe("reviews", () => {
  beforeEach(() => { resetMockDb(); token = null; });
  it("marks a review verified only when the reviewer received the part", async () => {
    await signIn("customer-web", CUSTOMER);
    expect((await api.reviews.create({ productId: "p-oil-filter", rating: 5, text: "Perfect fit, fast delivery." })).verifiedPurchase).toBe(true);
    expect((await api.reviews.create({ productId: "p-tyre-185", rating: 4, text: "Looks good, not fitted yet." })).verifiedPurchase).toBe(false);
    await expect(api.reviews.create({ productId: "p-oil-filter", rating: 5, text: "Second review attempt" })).rejects.toMatchObject({ code: "already_reviewed" });
  });
});

describe("trade, payouts, invoices", () => {
  beforeEach(() => { resetMockDb(); token = null; });
  it("distributor quotes an open RFQ once", async () => {
    await signIn("distributor-portal", DISTRIBUTOR);
    expect((await api.trade.quoteRfq("rfq-301", 5_900_000)).status).toBe("quoted");
    await expect(api.trade.quoteRfq("rfq-301", 5_800_000)).rejects.toMatchObject({ code: "rfq_closed" });
  });
  it("seller sees only their own payouts; finance releases them", async () => {
    await signIn("seller-portal", SELLER);
    const mine = await api.payouts.listMine();
    expect(mine.every((p) => p.vendorId === "ven-sri-ganesh")).toBe(true);
    await expect(api.payouts.release("po-1")).rejects.toMatchObject({ code: "forbidden" });
    await signIn("admin-portal", ADMIN);
    expect((await api.payouts.release("po-1")).status).toBe("paid");
  });
  it("issues a Telangana invoice with CGST + SGST", async () => {
    await signIn("customer-web", CUSTOMER);
    const inv = await api.invoices.forOrder("o-24702");
    expect(inv.interState).toBe(false);
    expect(inv.cgstPaise + inv.sgstPaise).toBe(inv.totalPaise - inv.taxablePaise);
  });
  it("towing operator sets a truck to maintenance", async () => {
    await signIn("towing-portal", TOWING);
    expect((await api.towing.setTruckStatus("tt-3", "maintenance")).status).toBe("maintenance");
  });
});
