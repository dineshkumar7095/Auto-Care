import type { Order, OrderStatus } from "@automotive/shared-types";
import type { CreateOrderInput } from "@automotive/validation";
import { request } from "../http";

export const ordersApi = {
  create: (input: CreateOrderInput) => request<Order>("POST", "/orders", { body: input }),
  listMine: () => request<Order[]>("GET", "/orders/mine"),
  listForVendor: (query: { status?: OrderStatus } = {}) => request<Order[]>("GET", "/orders/vendor", { query }),
  updateStatus: (id: string, status: OrderStatus) => request<Order>("PATCH", `/orders/${id}/status`, { body: { status } }),
};
