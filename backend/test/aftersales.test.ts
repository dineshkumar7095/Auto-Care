import { createHmac } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app, signIn, startDb, stopDb } from "./setup";

const CUSTOMER = "+919800000001", SELLER = "+919800000002", ADMIN = "+919800000004", DISTRIBUTOR = "+919800000005", OPERATOR = "+919800000006", DRIVER = "+919800000016", FLEET = "+919800000007";
const auth = (t?: string) => ({ Authorization: `Bearer ${t}` });

beforeAll(startDb);
afterAll(stopDb);

describe("returns & refunds", () => {
  it("customer → seller approves → finance refunds, order becomes returned", async () => {
    const c = await signIn(CUSTOMER, "customer-web");
    const r = await request(app).post("/api/v1/returns").set(auth(c.token)).send({ orderId: "o-24702", reason: "does_not_fit" });
    expect(r.status).toBe(201);
    const s = await signIn(SELLER, "seller-portal");
    expect((await request(app).post(`/api/v1/returns/${r.body.data.id}/decision`).set(auth(s.token)).send({ decision: "refund" })).status).toBe(403);
    expect((await request(app).post(`/api/v1/returns/${r.body.data.id}/decision`).set(auth(s.token)).send({ decision: "approve" })).status).toBe(200);
    const a = await signIn(ADMIN, "admin-portal");
    expect((await request(app).post(`/api/v1/returns/${r.body.data.id}/decision`).set(auth(a.token)).send({ decision: "refund" })).body.data.status).toBe("refunded");
    const mine = await request(app).get("/api/v1/orders/mine").set(auth(c.token));
    expect(mine.body.data.find((o: { id: string }) => o.id === "o-24702").status).toBe("returned");
  });
  it("refuses returns for undelivered orders", async () => {
    const c = await signIn(CUSTOMER, "customer-web");
    expect((await request(app).post("/api/v1/returns").set(auth(c.token)).send({ orderId: "o-24811", reason: "not_needed" })).status).toBe(409);
  });
});

describe("reviews", () => {
  it("verified purchase is decided by the server, one review per part", async () => {
    const c = await signIn(CUSTOMER, "customer-web");
    const r = await request(app).post("/api/v1/reviews").set(auth(c.token)).send({ productId: "p-tyre-185", rating: 4, text: "Not bought here but looks right." });
    expect(r.body.data.verifiedPurchase).toBe(false);
    expect((await request(app).post("/api/v1/reviews").set(auth(c.token)).send({ productId: "p-tyre-185", rating: 5, text: "Trying a second review" })).status).toBe(409);
  });
});

describe("distributor trade", () => {
  it("quotes an open RFQ and blocks a second quote", async () => {
    const d = await signIn(DISTRIBUTOR, "distributor-portal");
    expect((await request(app).post("/api/v1/trade/rfqs/rfq-301/quote").set(auth(d.token)).send({ totalPaise: 5_900_000 })).status).toBe(200);
    expect((await request(app).post("/api/v1/trade/rfqs/rfq-301/quote").set(auth(d.token)).send({ totalPaise: 5_800_000 })).status).toBe(409);
  });
  it("keeps sellers out of the trade desk", async () => {
    const s = await signIn(SELLER, "seller-portal");
    expect((await request(app).get("/api/v1/trade/rfqs").set(auth(s.token))).status).toBe(403);
  });
});

describe("payouts & invoices", () => {
  it("sellers read only their payouts; only finance releases", async () => {
    const s = await signIn(SELLER, "seller-portal");
    const mine = await request(app).get("/api/v1/payouts/mine").set(auth(s.token));
    expect(mine.body.data.every((p: { vendorId: string }) => p.vendorId === "ven-sri-ganesh")).toBe(true);
    expect((await request(app).post("/api/v1/payouts/po-1/release").set(auth(s.token))).status).toBe(403);
    const a = await signIn(ADMIN, "admin-portal");
    expect((await request(app).post("/api/v1/payouts/po-1/release").set(auth(a.token))).body.data.status).toBe("paid");
  });
  it("builds a Telangana GST invoice for the buyer", async () => {
    const c = await signIn(CUSTOMER, "customer-web");
    const inv = await request(app).get("/api/v1/orders/o-24811/invoice").set(auth(c.token));
    expect(inv.status).toBe(200);
    expect(inv.body.data.interState).toBe(false);
    expect(inv.body.data.cgstPaise + inv.body.data.sgstPaise).toBe(inv.body.data.totalPaise - inv.body.data.taxablePaise);
  });
});

describe("towing drivers & fleet", () => {
  it("drivers only see open requests and their own trips, and can advance them", async () => {
    const d = await signIn(DRIVER, "towing-portal");
    const trips = await request(app).get("/api/v1/towing/trips").set(auth(d.token));
    expect(trips.body.data.every((t: { status: string; driverName: string | null }) => t.status === "requested" || t.driverName === "Shiva")).toBe(true);
    expect((await request(app).patch("/api/v1/towing/trucks/tt-3").set(auth(d.token)).send({ status: "maintenance" })).status).toBe(403);
    const o = await signIn(OPERATOR, "towing-portal");
    expect((await request(app).patch("/api/v1/towing/trucks/tt-3").set(auth(o.token)).send({ status: "maintenance" })).status).toBe(200);
  });
  it("returns monthly fleet spend", async () => {
    const f = await signIn(FLEET, "fleet-portal");
    expect((await request(app).get("/api/v1/fleet/spend").set(auth(f.token))).body.data).toHaveLength(6);
  });
});

describe("payment webhook", () => {
  it("rejects unsigned events and captures signed ones", async () => {
    const c = await signIn(CUSTOMER, "customer-web");
    const intent = await request(app).post("/api/v1/payments/intents").set(auth(c.token)).send({ orderId: "o-24811" });
    expect(intent.status).toBe(201);
    const body = JSON.stringify({ providerRef: intent.body.data.providerRef, status: "paid" });
    expect((await request(app).post("/api/v1/payments/webhook").set("content-type", "application/json").send(body)).status).toBe(400);
    const sig = createHmac("sha256", "dev-webhook-secret-change-me").update(body).digest("hex");
    expect((await request(app).post("/api/v1/payments/webhook").set("content-type", "application/json").set("x-mock-signature", sig).send(body)).status).toBe(200);
  });
});
