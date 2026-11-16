import { describe, expect, it } from "vitest";
import type { TowTruck } from "@automotive/shared-types";
import { trucksForTrip } from "./truck-rules";

const t = (id: string, evSafe: boolean, status: TowTruck["status"] = "available"): TowTruck => ({ id, vendorId: "v", registration: id, type: "flatbed", evSafe, driverName: null, driverPhone: null, status });

describe("truck matching", () => {
  it("only offers EV-safe trucks for EV trips", () => {
    expect(trucksForTrip([t("a", false), t("b", true)], { issue: "ev_support" }).map((x) => x.id)).toEqual(["b"]);
  });
  it("never offers trucks that are busy or in maintenance", () => {
    expect(trucksForTrip([t("a", true, "on_trip"), t("b", true, "maintenance")], { issue: "breakdown" })).toEqual([]);
  });
});
