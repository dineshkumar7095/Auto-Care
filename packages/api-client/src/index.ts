import { invoicesApi, notificationsApi, payoutsApi, returnsApi, reviewsApi } from "./endpoints/aftersales";
import { adminSearchApi, branchStockApi, settingsApi, supportApi, teamApi, vendorReviewsApi } from "./endpoints/workspace";
import { tradeApi } from "./endpoints/trade";
import { adminApi } from "./endpoints/admin";
import { authApi } from "./endpoints/auth";
import { bookingsApi } from "./endpoints/bookings";
import { catalogueApi } from "./endpoints/catalogue";
import { fleetApi } from "./endpoints/fleet";
import { ordersApi } from "./endpoints/orders";
import { towingApi } from "./endpoints/towing";
import { vendorsApi } from "./endpoints/vendors";

/** One typed client for every portal. Each group maps 1:1 to a backend module under /api/v1. */
export const api = {
  auth: authApi,
  catalogue: catalogueApi,
  orders: ordersApi,
  bookings: bookingsApi,
  towing: towingApi,
  vendors: vendorsApi,
  fleet: fleetApi,
  admin: { ...adminApi, ...adminSearchApi },
  trade: tradeApi,
  reviews: { ...reviewsApi, ...vendorReviewsApi },
  returns: returnsApi,
  payouts: payoutsApi,
  notifications: notificationsApi,
  invoices: invoicesApi,
  inventory: branchStockApi,
  team: teamApi,
  settings: settingsApi,
  support: supportApi,
};

export { configureApiClient, getApiConfig, type ApiClientConfig } from "./config";
export { ApiError } from "./errors";
export { resetMockDb } from "./mock/server";
export type { ProductQuery } from "./endpoints/catalogue";
export type { AdminOrderQuery } from "./endpoints/workspace";
export type { AdminOverview } from "./endpoints/admin";
