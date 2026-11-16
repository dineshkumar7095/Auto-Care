import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app, signIn, startDb, stopDb } from "./setup";

const CUSTOMER = "+919800000001";
const SELLER = "+919800000002";
const WORKSHOP = "+919800000003";
const ADMIN = "+919800000004";

beforeAll(startDb);
afterAll(stopDb);

const auth = (token?: string) => ({ Authorization: `Bearer ${token}` });

describe("central authentication", () => {
  it("rejects a wrong code", async () => {
    await request(app).post("/api/v1/auth/otp/request").send({ phone: SELLER });
    const res = await request(app).post("/api/v1/auth/otp/verify").send({ phone: SELLER, code: "000000", portal: "seller-portal" });
    expect(res.status).toBe(401);
  });
  it("won't let a customer into the seller portal", async () => {
    const r = await signIn(CUSTOMER, "seller-portal");
    expect(r.status).toBe(403);
    expect(r.body.error.code).toBe("portal_forbidden");
  });
  it("blocks unauthenticated calls", async () => {
    expect((await request(app).get("/api/v1/orders/vendor")).status).toBe(401);
  });
});

describe("role-based access", () => {
  it("only admins can see partner applications", async () => {
    const seller = await signIn(SELLER, "seller-portal");
    expect((await request(app).get("/api/v1/vendors").set(auth(seller.token))).status).toBe(403);
    const admin = await signIn(ADMIN, "admin-portal");
    const res = await request(app).get("/api/v1/vendors?status=pending").set(auth(admin.token));
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  it("refuses to approve a partner with unverified documents", async () => {
    const admin = await signIn(ADMIN, "admin-portal");
    const res = await request(app).post("/api/v1/vendors/ven-dent-shine/decision").set(auth(admin.token)).send({ decision: "approve" });
    expect(res.status).toBe(409);
  });
});

describe("orders", () => {
  it("prices from the database, splits per seller and reserves stock", async () => {
    const customer = await signIn(CUSTOMER, "customer-web");
    const before = await request(app).get("/api/v1/catalogue/products/p-oil-filter");
    const res = await request(app)
      .post("/api/v1/orders")
      .set(auth(customer.token))
      .send({ lines: [{ productId: "p-oil-filter", quantity: 2 }], fulfilment: "pickup" });
    expect(res.status).toBe(201);
    expect(res.body.data.totals.totalPaise).toBe(2 * 32000);
    const after = await request(app).get("/api/v1/catalogue/products/p-oil-filter");
    expect(after.body.data.product.stock).toBe(before.body.data.product.stock - 2);
  });
  it("won't sell more than is in stock", async () => {
    const customer = await signIn(CUSTOMER, "customer-web");
    const res = await request(app).post("/api/v1/orders").set(auth(customer.token)).send({ lines: [{ productId: "p-headlamp", quantity: 99 }], fulfilment: "pickup" });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("out_of_stock");
  });
  it("lets the seller accept but not skip straight to dispatched", async () => {
    const seller = await signIn(SELLER, "seller-portal");
    expect((await request(app).patch("/api/v1/orders/o-24811/status").set(auth(seller.token)).send({ status: "accepted" })).status).toBe(200);
    const skip = await request(app).patch("/api/v1/orders/o-24807/status").set(auth(seller.token)).send({ status: "dispatched" });
    expect(skip.status).toBe(409);
  });
});

describe("workshop jobs", () => {
  it("can't start repair before the customer approves the estimate", async () => {
    const ws = await signIn(WORKSHOP, "workshop-portal");
    const res = await request(app).patch("/api/v1/bookings/jobs/jc-1042/stage").set(auth(ws.token)).send({ stage: "in_repair" });
    expect(res.status).toBe(400);
  });
  it("only lists EV-qualified workshops for EV diagnostics", async () => {
    const res = await request(app).get("/api/v1/bookings/workshops?service=EV%20diagnostics");
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data.every((w: { evQualified: boolean }) => w.evQualified)).toBe(true);
  });
});
