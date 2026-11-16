import type { OrderLine, OrderTotals } from "@automotive/shared-types";

/** Format integer paise as Indian rupees, e.g. 189900 -> "₹1,899". */
export const formatINR = (paise: number, opts: { decimals?: boolean } = {}) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: opts.decimals ? 2 : 0,
    maximumFractionDigits: opts.decimals ? 2 : 0,
  }).format(paise / 100);

export const rupeesToPaise = (rupees: number) => Math.round(rupees * 100);

/** Tax-inclusive prices (Indian retail norm): extract GST from a gross amount. */
export const gstFromInclusive = (grossPaise: number, ratePct: number) => Math.round((grossPaise * ratePct) / (100 + ratePct));

/** Compute order totals from lines. Unit prices are GST-inclusive. All maths in integer paise. */
export function computeOrderTotals(lines: readonly OrderLine[], opts: { shippingPaise?: number; discountPaise?: number } = {}): OrderTotals {
  const gross = lines.reduce((sum, l) => sum + l.unitPricePaise * l.quantity, 0);
  const taxPaise = lines.reduce((sum, l) => sum + gstFromInclusive(l.unitPricePaise * l.quantity, l.gstRatePct), 0);
  const shippingPaise = opts.shippingPaise ?? 0;
  const discountPaise = Math.min(opts.discountPaise ?? 0, gross);
  return { subtotalPaise: gross - taxPaise, taxPaise, shippingPaise, discountPaise, totalPaise: gross + shippingPaise - discountPaise };
}

export const discountPct = (pricePaise: number, mrpPaise: number) => (mrpPaise > 0 ? Math.round((1 - pricePaise / mrpPaise) * 100) : 0);
