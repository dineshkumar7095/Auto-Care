import { describe, expect, it } from "vitest";
import { buildGstInvoice, canQuoteRfq, canRequestReturn, computePayout, creditDecision } from "./commerce";

const meta = { invoiceNumber: "INV-1", sellerName: "Sri Ganesh", issuedAt: "2026-11-13T00:00:00Z" };
const order = { number: "ORD-1", customerName: "Arjun", lines: [{ productId: "p", title: "Pads", quantity: 1, unitPricePaise: 118000, gstRatePct: 18 }] };

describe("GST invoice", () => {
  it("splits CGST and SGST equally inside Telangana", () => {
    const inv = buildGstInvoice(order, { ...meta, sellerState: "Telangana", buyerState: "Telangana" });
    expect(inv.taxablePaise).toBe(100000);
    expect(inv.cgstPaise).toBe(9000);
    expect(inv.sgstPaise).toBe(9000);
    expect(inv.igstPaise).toBe(0);
  });
  it("charges IGST for another state", () => {
    const inv = buildGstInvoice(order, { ...meta, sellerState: "Telangana", buyerState: "Andhra Pradesh" });
    expect(inv.igstPaise).toBe(18000);
    expect(inv.cgstPaise + inv.sgstPaise).toBe(0);
  });
});

describe("payouts", () => {
  it("deducts commission, 0.1% TDS and refunds", () => {
    const p = computePayout({ grossPaise: 1_000_000, commissionBps: 800, refundsPaise: 100_000 });
    expect(p.commissionPaise).toBe(80_000);
    expect(p.tdsPaise).toBe(900);
    expect(p.netPaise).toBe(819_100);
  });
});

describe("returns", () => {
  const now = new Date("2026-11-13T00:00:00Z");
  it("allows a return 7 days after delivery", () => {
    expect(canRequestReturn({ status: "delivered", createdAt: "2026-11-01T00:00:00Z", deliveredAt: "2026-11-06T00:00:00Z" }, now)).toBe(true);
  });
  it("refuses after 7 days", () => {
    expect(canRequestReturn({ status: "delivered", createdAt: "2026-11-01T00:00:00Z", deliveredAt: "2026-11-05T00:00:00Z" }, now)).toBe(false);
  });
  it("refuses orders not delivered yet", () => {
    expect(canRequestReturn({ status: "dispatched", createdAt: "2026-11-12T00:00:00Z" }, now)).toBe(false);
  });
});

describe("trade credit", () => {
  const acc = { id: "c", vendorId: "v", buyerName: "b", limitPaise: 100_000, usedPaise: 60_000, termsDays: 30, overdueDays: 0 };
  it("allows within the limit", () => expect(creditDecision(acc, 40_000).allowed).toBe(true));
  it("blocks over the limit", () => expect(creditDecision(acc, 40_001).allowed).toBe(false));
  it("blocks buyers over 30 days overdue", () => expect(creditDecision({ ...acc, overdueDays: 31 }, 1).allowed).toBe(false));
});

describe("RFQ quoting", () => {
  const now = new Date("2026-11-13T00:00:00Z");
  it("only quotes open, unexpired RFQs", () => {
    expect(canQuoteRfq({ status: "open", expiresAt: "2026-11-14T00:00:00Z" }, now)).toBe(true);
    expect(canQuoteRfq({ status: "open", expiresAt: "2026-11-12T00:00:00Z" }, now)).toBe(false);
    expect(canQuoteRfq({ status: "quoted", expiresAt: "2026-11-14T00:00:00Z" }, now)).toBe(false);
  });
});
