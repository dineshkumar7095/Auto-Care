import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app, signIn, startDb, stopDb } from "./setup";

const CUSTOMER = "+919800000001", SELLER = "+919800000002", WORKSHOP = "+919800000003", ADMIN = "+919800000004";
const auth = (t?: string) => ({ Authorization: `Bearer ${t}` });

beforeAll(startDb);
afterAll(stopDb);

describe("team", () => {
  it("each business only sees its own team and can't add the same phone twice", async () => {
    const w = await signIn(WORKSHOP, "workshop-portal");
    const list = await request(app).get("/api/v1/team").set(auth(w.token));
    expect(list.body.data.map((m: { name: string }) => m.name)).toContain("Ramesh Goud");
    expect(list.body.data.some((m: { name: string }) => m.name === "Lakshmi Rao")).toBe(false);
    const add = await request(app).post("/api/v1/team").set(auth(w.token)).send({ name: "Kiran", phone: "9811100099", title: "Technician" });
    expect(add.status).toBe(201);
    expect((await request(app).post("/api/v1/team").set(auth(w.token)).send({ name: "Kiran 2", phone: "9811100099", title: "Technician" })).status).toBe(409);
    const off = await request(app).patch(`/api/v1/team/${add.body.data.id}`).set(auth(w.token)).send({ active: false });
    expect(off.body.data.active).toBe(false);
    const s = await signIn(SELLER, "seller-portal");
    expect((await request(app).patch(`/api/v1/team/${add.body.data.id}`).set(auth(s.token)).send({ active: true })).status).toBe(404);
  });
  it("customers have no team", async () => {
    const c = await signIn(CUSTOMER, "customer-web");
    expect((await request(app).get("/api/v1/team").set(auth(c.token))).status).toBe(403);
  });
});

describe("settings", () => {
  it("saves and reads back per business", async () => {
    const s = await signIn(SELLER, "seller-portal");
    expect((await request(app).get("/api/v1/settings").set(auth(s.token))).body.data.values).toEqual({});
    await request(app).put("/api/v1/settings").set(auth(s.token)).send({ values: { dispatchHours: 24, codEnabled: true } }).expect(200);
    expect((await request(app).get("/api/v1/settings").set(auth(s.token))).body.data.values).toEqual({ dispatchHours: 24, codEnabled: true });
    const w = await signIn(WORKSHOP, "workshop-portal");
    expect((await request(app).get("/api/v1/settings").set(auth(w.token))).body.data.values).toEqual({});
  });
});

describe("support tickets & admin search", () => {
  it("only admins see tickets; resolved tickets can only reopen", async () => {
    const s = await signIn(SELLER, "seller-portal");
    expect((await request(app).get("/api/v1/support/tickets").set(auth(s.token))).status).toBe(403);
    const a = await signIn(ADMIN, "admin-portal");
    expect((await request(app).patch("/api/v1/support/tickets/tk-4").set(auth(a.token)).send({ status: "in_progress" })).status).toBe(409);
    expect((await request(app).patch("/api/v1/support/tickets/tk-1").set(auth(a.token)).send({ status: "resolved" })).body.data.status).toBe("resolved");
  });
  it("finds orders by number or customer name", async () => {
    const a = await signIn(ADMIN, "admin-portal");
    const byName = await request(app).get("/api/v1/admin/orders").query({ q: "sameer" }).set(auth(a.token));
    expect(byName.body.data.map((o: { number: string }) => o.number)).toContain("ORD-24690");
    const byNumber = await request(app).get("/api/v1/admin/orders").query({ q: "24690" }).set(auth(a.token));
    expect(byNumber.body.data).toHaveLength(1);
  });
});
