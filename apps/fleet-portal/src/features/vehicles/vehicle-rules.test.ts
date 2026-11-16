import { isServiceDue } from "./vehicle-rules";

describe("service due", () => {
  it("flags a vehicle within 1,000 km of service", () => expect(isServiceDue({ odometerKm: 49200, nextServiceKm: 50000 })).toBe(true));
  it("flags an overdue vehicle", () => expect(isServiceDue({ odometerKm: 50340, nextServiceKm: 50000 })).toBe(true));
  it("does not flag a vehicle far from service", () => expect(isServiceDue({ odometerKm: 31220, nextServiceKm: 40000 })).toBe(false));
});
