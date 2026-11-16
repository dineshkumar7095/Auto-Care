import { describe, expect, it } from "vitest";
import { computeOrderTotals, formatINR, gstFromInclusive } from "../src/money";

describe("money", () => {
  it("formats paise as rupees", () => {
    expect(formatINR(189900)).toBe("₹1,899");
  });
  it("extracts 18% GST from an inclusive price", () => {
    expect(gstFromInclusive(11800, 18)).toBe(1800);
  });
  it("totals an order in integer paise", () => {
    const t = computeOrderTotals(
      [
        { productId: "a", title: "A", quantity: 2, unitPricePaise: 11800, gstRatePct: 18 },
        { productId: "b", title: "B", quantity: 1, unitPricePaise: 10500, gstRatePct: 5 },
      ],
      { shippingPaise: 4900, discountPaise: 1000 },
    );
    expect(t.taxPaise).toBe(3600 + 500);
    expect(t.subtotalPaise).toBe(34100 - 4100);
    expect(t.totalPaise).toBe(34100 + 4900 - 1000);
  });
});
