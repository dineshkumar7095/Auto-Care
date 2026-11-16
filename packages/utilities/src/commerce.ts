import type { CreditAccount, GstInvoice, InvoiceLine, Order, Rfq } from "@automotive/shared-types";
import { gstFromInclusive } from "./money";

// ---------- GST invoices ----------
/** Splits GST-inclusive order lines into a tax invoice. Same state → CGST+SGST halves; different states → IGST. */
export function buildGstInvoice(
  order: Pick<Order, "number" | "customerName" | "lines">,
  meta: { invoiceNumber: string; sellerName: string; sellerState: string; buyerState: string; issuedAt: string },
): GstInvoice {
  const interState = meta.sellerState.trim().toLowerCase() !== meta.buyerState.trim().toLowerCase();
  const lines: InvoiceLine[] = order.lines.map((l) => {
    const gross = l.unitPricePaise * l.quantity;
    const gst = gstFromInclusive(gross, l.gstRatePct);
    const cgst = interState ? 0 : Math.floor(gst / 2);
    const sgst = interState ? 0 : gst - cgst;
    return { title: l.title, quantity: l.quantity, taxablePaise: gross - gst, gstRatePct: l.gstRatePct, cgstPaise: cgst, sgstPaise: sgst, igstPaise: interState ? gst : 0, totalPaise: gross };
  });
  const sum = (k: keyof Pick<InvoiceLine, "taxablePaise" | "cgstPaise" | "sgstPaise" | "igstPaise" | "totalPaise">) => lines.reduce((s, l) => s + l[k], 0);
  return {
    invoiceNumber: meta.invoiceNumber,
    orderNumber: order.number,
    sellerName: meta.sellerName,
    sellerState: meta.sellerState,
    buyerName: order.customerName,
    buyerState: meta.buyerState,
    interState,
    lines,
    taxablePaise: sum("taxablePaise"),
    cgstPaise: sum("cgstPaise"),
    sgstPaise: sum("sgstPaise"),
    igstPaise: sum("igstPaise"),
    totalPaise: sum("totalPaise"),
    issuedAt: meta.issuedAt,
  };
}

// ---------- partner payouts ----------
/** Platform commission per partner type, in basis points (1% = 100). Change rates here only. */
export const COMMISSION_BPS = { seller: 800, distributor: 400, workshop: 1000, towing: 1200 } as const;
/** TDS under section 194-O, in basis points (0.1% = 10). */
export const TDS_194O_BPS = 10;

export function computePayout(input: { grossPaise: number; commissionBps: number; refundsPaise?: number; tdsBps?: number }) {
  const refundsPaise = input.refundsPaise ?? 0;
  const commissionPaise = Math.round((input.grossPaise * input.commissionBps) / 10_000);
  const tdsPaise = Math.round((Math.max(0, input.grossPaise - refundsPaise) * (input.tdsBps ?? TDS_194O_BPS)) / 10_000);
  const netPaise = Math.max(0, input.grossPaise - commissionPaise - tdsPaise - refundsPaise);
  return { grossPaise: input.grossPaise, commissionPaise, tdsPaise, refundsPaise, netPaise };
}

// ---------- returns ----------
export const RETURN_WINDOW_DAYS = 7;
const DAY_MS = 86_400_000;

/** A delivered order can be returned within the window, counted from delivery (or the order date if delivery wasn't recorded). */
export function canRequestReturn(order: Pick<Order, "status" | "createdAt" | "deliveredAt">, now: Date = new Date()): boolean {
  if (order.status !== "delivered") return false;
  const from = new Date(order.deliveredAt ?? order.createdAt).getTime();
  return now.getTime() - from <= RETURN_WINDOW_DAYS * DAY_MS;
}

// ---------- trade credit ----------
/** Buyers more than this many days overdue can't take more stock on credit. */
export const CREDIT_HOLD_OVERDUE_DAYS = 30;
export const creditAvailable = (a: Pick<CreditAccount, "limitPaise" | "usedPaise">) => Math.max(0, a.limitPaise - a.usedPaise);
export function creditDecision(a: CreditAccount, orderPaise: number): { allowed: boolean; reason?: string } {
  if (a.overdueDays > CREDIT_HOLD_OVERDUE_DAYS) return { allowed: false, reason: `Payment overdue by ${a.overdueDays} days` };
  if (orderPaise > creditAvailable(a)) return { allowed: false, reason: "Over credit limit" };
  return { allowed: true };
}

// ---------- RFQs ----------
export function canQuoteRfq(rfq: Pick<Rfq, "status" | "expiresAt">, now: Date = new Date()): boolean {
  return rfq.status === "open" && new Date(rfq.expiresAt).getTime() > now.getTime();
}

/** Applies a whole-number percent discount to a paise amount. */
export const applyDiscountPct = (paise: number, pct: number) => Math.round((paise * (100 - pct)) / 100);
