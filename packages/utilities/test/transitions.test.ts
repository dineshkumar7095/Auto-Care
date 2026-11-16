import { describe, expect, it } from "vitest";
import { JOB_TRANSITIONS, ORDER_TRANSITIONS } from "@automotive/shared-types";
import { assertTransition, canTransition } from "../src/transitions";

describe("order transitions", () => {
  it("allows placed -> accepted", () => expect(canTransition(ORDER_TRANSITIONS, "placed", "accepted")).toBe(true));
  it("blocks skipping from placed straight to dispatched", () => expect(canTransition(ORDER_TRANSITIONS, "placed", "dispatched")).toBe(false));
  it("cannot cancel after dispatch", () => expect(canTransition(ORDER_TRANSITIONS, "dispatched", "cancelled")).toBe(false));
});

describe("job card transitions", () => {
  it("repair cannot start before customer approval when an estimate is pending", () => {
    expect(canTransition(JOB_TRANSITIONS, "awaiting_approval", "in_repair")).toBe(true);
    expect(canTransition(JOB_TRANSITIONS, "checked_in", "in_repair")).toBe(false);
  });
  it("throws on an illegal move", () => {
    expect(() => assertTransition(JOB_TRANSITIONS, "booked", "ready")).toThrow(/Cannot move/);
  });
});
