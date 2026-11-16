import { describe, expect, it } from "vitest";
import { normaliseIndianPhone } from "./phone";

describe("normaliseIndianPhone", () => {
  it.each(["98000 00001", "+91 98000 00001", "09800000001", "919800000001"])("%s → +919800000001", (v) => {
    expect(normaliseIndianPhone(v)).toBe("+919800000001");
  });
});
