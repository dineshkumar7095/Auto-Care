import { describe, expect, it } from "vitest";
import { canAccessPortal, hasPermission } from "../src/roles";

describe("portal access", () => {
  it("lets a seller into the seller portal only", () => {
    expect(canAccessPortal(["seller_owner"], "seller-portal")).toBe(true);
    expect(canAccessPortal(["seller_owner"], "admin-portal")).toBe(false);
  });
  it("lets a technician into the workshop portal", () => {
    expect(canAccessPortal(["technician"], "workshop-portal")).toBe(true);
  });
  it("blocks customers from every business portal", () => {
    expect(canAccessPortal(["customer"], "seller-portal")).toBe(false);
    expect(canAccessPortal(["customer"], "workshop-portal")).toBe(false);
  });
});

describe("permissions", () => {
  it("only ops or super admins approve partners", () => {
    expect(hasPermission(["admin_ops"], "partners:approve")).toBe(true);
    expect(hasPermission(["admin_support"], "partners:approve")).toBe(false);
  });
  it("technicians cannot write estimates", () => {
    expect(hasPermission(["technician"], "jobs:estimate")).toBe(false);
    expect(hasPermission(["workshop_manager"], "jobs:estimate")).toBe(true);
  });
});
