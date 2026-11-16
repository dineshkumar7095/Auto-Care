import { describe, expect, it } from "vitest";
import { fitmentBadge } from "./fitment";

describe("fitment badge", () => {
  it("only shows green for catalogue-verified fits", () => {
    expect(fitmentBadge("verified").tone).toBe("success");
    expect(fitmentBadge("seller-confirmed").tone).not.toBe("success");
    expect(fitmentBadge("not-verified").label).toBe("Fit not verified");
  });
});
