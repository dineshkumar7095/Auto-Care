import { describe, expect, it } from "vitest";
import type { TowingTrip } from "@automotive/shared-types";
import { directionsUrl, sortForDriver } from "./trip-view";

const trip = (id: string, status: TowingTrip["status"], driverName: string | null): TowingTrip => ({ id, number: id, customerName: "c", issue: "breakdown", pickup: "p", drop: "d", providerId: "v", driverName, status, etaMin: null, quotedPaise: 1 });

describe("driver job list", () => {
  it("puts my live trip first, then new requests, then finished", () => {
    const sorted = sortForDriver([trip("done", "completed", "Shiva"), trip("new", "requested", null), trip("mine", "en_route", "Shiva")], "Shiva");
    expect(sorted.map((t) => t.id)).toEqual(["mine", "new", "done"]);
  });
  it("builds a Hyderabad directions link", () => {
    expect(directionsUrl("ORR, Kokapet")).toContain("ORR%2C%20Kokapet%2C%20Hyderabad");
  });
});
