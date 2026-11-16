import { describe, expect, it } from "vitest";
import { otpRequestSchema, productInputSchema, vendorDecisionSchema } from "../src";

describe("validation", () => {
  it("normalises Indian mobile numbers to +91", () => {
    expect(otpRequestSchema.parse({ phone: "98450 12345" }).phone).toBe("+919845012345");
  });
  it("rejects a mobile number starting with 5", () => {
    expect(otpRequestSchema.safeParse({ phone: "5845012345" }).success).toBe(false);
  });
  const base = { title: "Brake pads", brand: "Bosch", partNumber: "0986AB", category: "Brakes", partClass: "OES", pricePaise: 189900, mrpPaise: 245000, stock: 3 } as const;
  it("rejects price above MRP", () => {
    expect(productInputSchema.safeParse({ ...base, pricePaise: 300000 }).success).toBe(false);
  });
  it("requires proof for OEM claims", () => {
    expect(productInputSchema.safeParse({ ...base, partClass: "OEM" }).success).toBe(false);
    expect(productInputSchema.safeParse({ ...base, partClass: "OEM", proofDocumentUrl: "https://x.in/proof.pdf" }).success).toBe(true);
  });
  it("needs a reason to reject a partner", () => {
    expect(vendorDecisionSchema.safeParse({ decision: "reject" }).success).toBe(false);
    expect(vendorDecisionSchema.safeParse({ decision: "approve" }).success).toBe(true);
  });
});
