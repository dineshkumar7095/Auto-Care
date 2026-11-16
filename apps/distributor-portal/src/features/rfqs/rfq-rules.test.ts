import { describe, expect, it } from "vitest";
import { hoursLeft, suggestedQuotePaise } from "./rfq-rules";

describe("RFQ helpers", () => {
  it("suggests the buyer's target total when every line has a target", () => {
    expect(suggestedQuotePaise({ lines: [{ title: "a", partNumber: "x", quantity: 10, targetUnitPaise: 420000 }, { title: "b", partNumber: "y", quantity: 20, targetUnitPaise: 95000 }] })).toBe(6_100_000);
  });
  it("leaves it blank when a line has no target", () => {
    expect(suggestedQuotePaise({ lines: [{ title: "a", partNumber: "x", quantity: 1, targetUnitPaise: null }] })).toBeNull();
  });
  it("counts hours left, never below zero", () => {
    const now = new Date("2026-11-13T00:00:00Z");
    expect(hoursLeft("2026-11-13T05:00:00Z", now)).toBe(5);
    expect(hoursLeft("2026-11-12T00:00:00Z", now)).toBe(0);
  });
});
