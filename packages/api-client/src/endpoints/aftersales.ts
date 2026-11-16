import type { AppNotification, GstInvoice, Payout, Review, ReturnRequest } from "@automotive/shared-types";
import type { ReturnRequestInput, ReviewInput } from "@automotive/validation";
import { request } from "../http";

export const reviewsApi = {
  listForProduct: (productId: string) => request<Review[]>("GET", "/reviews", { query: { productId } }),
  create: (input: ReviewInput) => request<Review>("POST", "/reviews", { body: input }),
};

export const returnsApi = {
  request: (input: ReturnRequestInput) => request<ReturnRequest>("POST", "/returns", { body: input }),
  listMine: () => request<ReturnRequest[]>("GET", "/returns/mine"),
  listForVendor: () => request<ReturnRequest[]>("GET", "/returns/vendor"),
  listAll: () => request<ReturnRequest[]>("GET", "/returns"),
  decide: (id: string, decision: "approve" | "reject" | "refund") => request<ReturnRequest>("POST", `/returns/${id}/decision`, { body: { decision } }),
};

export const payoutsApi = {
  listMine: () => request<Payout[]>("GET", "/payouts/mine"),
  listAll: () => request<Payout[]>("GET", "/payouts"),
  release: (id: string) => request<Payout>("POST", `/payouts/${id}/release`),
};

export const notificationsApi = {
  list: () => request<AppNotification[]>("GET", "/notifications"),
  markRead: (id: string) => request<AppNotification>("POST", `/notifications/${id}/read`),
};

export const invoicesApi = {
  forOrder: (orderId: string) => request<GstInvoice>("GET", `/orders/${orderId}/invoice`),
};
