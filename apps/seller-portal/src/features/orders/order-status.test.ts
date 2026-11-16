import { nextSellerAction } from "./order-status";

describe("seller order actions", () => {
  it("offers Accept for a new order", () => expect(nextSellerAction("placed")?.to).toBe("accepted"));
  it("offers Dispatch only after packing", () => {
    expect(nextSellerAction("packed")?.to).toBe("dispatched");
    expect(nextSellerAction("accepted")?.to).toBe("packed");
  });
  it("offers nothing once delivered", () => expect(nextSellerAction("delivered")).toBeNull());
});
