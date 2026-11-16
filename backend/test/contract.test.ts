/**
 * Contract test: the shared api-client (used by every portal) is pointed at this real backend,
 * and each call's response shape is compared with the demo-mode mock server. If they drift, portals break.
 */
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { api, configureApiClient, resetMockDb } from "@automotive/api-client";
import { DEMO_ACCOUNT_BY_PORTAL, DEMO_OTP } from "@automotive/api-client/fixtures";
import type { PortalId } from "@automotive/shared-types";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app, startDb, stopDb } from "./setup";

let server: Server;
let baseUrl = "";
let token: string | null = null;

beforeAll(async () => {
  await startDb();
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/v1`;
});
afterAll(async () => {
  server?.close();
  await stopDb();
});

async function as<T>(mode: "mock" | "real", portal: PortalId | null, call: () => Promise<T>): Promise<T> {
  configureApiClient({ useMocks: mode === "mock", baseUrl, getToken: () => token });
  token = null;
  if (portal) {
    const phone = DEMO_ACCOUNT_BY_PORTAL[portal];
    await api.auth.requestOtp({ phone });
    token = (await api.auth.verifyOtp({ phone, code: DEMO_OTP, portal })).accessToken;
  }
  return call();
}

/** Recursively collects "path:type" so we compare structure, not values. */
function shape(value: unknown, path = "$", out = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    out.add(`${path}:array`);
    if (value[0] !== undefined) shape(value[0], `${path}[]`, out);
  } else if (value && typeof value === "object") {
    // `specs` is a free-form map whose keys vary per product, so only its type is compared.
    if (path.endsWith(".specs")) out.add(`${path}:object`);
    else for (const [k, v] of Object.entries(value)) if (v !== null && v !== undefined) shape(v, `${path}.${k}`, out);
  } else if (value !== null && value !== undefined) out.add(`${path}:${typeof value}`);
  return out;
}

const cases: [string, PortalId | null, () => Promise<unknown>][] = [
  ["catalogue.listProducts", null, () => api.catalogue.listProducts({ q: "filter" })],
  ["catalogue.getProduct", null, () => api.catalogue.getProduct("p-oil-filter")],
  ["bookings.listWorkshops", null, () => api.bookings.listWorkshops({})],
  ["towing.listProviders", null, () => api.towing.listProviders({})],
  ["auth.me", "seller-portal", () => api.auth.me()],
  ["orders.listForVendor", "seller-portal", () => api.orders.listForVendor({})],
  ["catalogue.listMyListings", "seller-portal", () => api.catalogue.listMyListings()],
  ["bookings.listJobs", "workshop-portal", () => api.bookings.listJobs()],
  ["bookings.listToday", "workshop-portal", () => api.bookings.listToday()],
  ["vendors.list", "admin-portal", () => api.vendors.list({ status: "pending" })],
  ["admin.overview", "admin-portal", () => api.admin.overview()],
  ["orders.listForVendor (distributor)", "distributor-portal", () => api.orders.listForVendor({})],
  ["towing.listTrips", "towing-portal", () => api.towing.listTrips()],
  ["fleet.listVehicles", "fleet-portal", () => api.fleet.listVehicles()],
  ["fleet.listApprovals", "fleet-portal", () => api.fleet.listApprovals()],
  ["fleet.spend", "fleet-portal", () => api.fleet.spend()],
  ["trade.listRfqs", "distributor-portal", () => api.trade.listRfqs()],
  ["trade.listPriceLists", "distributor-portal", () => api.trade.listPriceLists()],
  ["trade.listCredit", "distributor-portal", () => api.trade.listCredit()],
  ["towing.listTrucks", "towing-portal", () => api.towing.listTrucks()],
  ["reviews.listForProduct", null, () => api.reviews.listForProduct("p-brake-pad-swift")],
  ["returns.listForVendor", "seller-portal", () => api.returns.listForVendor()],
  ["returns.listAll", "admin-portal", () => api.returns.listAll()],
  ["payouts.listMine", "seller-portal", () => api.payouts.listMine()],
  ["payouts.listAll", "admin-portal", () => api.payouts.listAll()],
  ["notifications.list", "seller-portal", () => api.notifications.list()],
  ["team.list (workshop)", "workshop-portal", () => api.team.list()],
  ["team.list (seller)", "seller-portal", () => api.team.list()],
  ["support.listTickets", "admin-portal", () => api.support.listTickets()],
  ["admin.orders", "admin-portal", () => api.admin.orders({ q: "ORD" })],
  ["admin.bookings", "admin-portal", () => api.admin.bookings()],
  ["admin.trips", "admin-portal", () => api.admin.trips()],
  ["reviews.listForVendor", "workshop-portal", () => api.reviews.listForVendor()],
  ["inventory.listBranchStock", "distributor-portal", () => api.inventory.listBranchStock()],
  ["invoices.forOrder", "customer-web", () => api.invoices.forOrder("o-24702")],
];

describe("real backend matches the api-client contract", () => {
  it.each(cases)("%s", async (_name, portal, call) => {
    resetMockDb();
    const mock = shape(await as("mock", portal, call));
    const real = shape(await as("real", portal, call));
    const missing = [...mock].filter((k) => !real.has(k));
    expect(missing).toEqual([]);
  });
});
