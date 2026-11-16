import type { BranchStock, Booking, BusinessSettings, Order, OrderStatus, Review, SettingValue, SupportTicket, TeamMember, TicketStatus, TowingTrip } from "@automotive/shared-types";
import type { TeamMemberInput } from "@automotive/validation";
import { request } from "../http";

/** Team of the signed-in business (vendor, fleet, or the platform for admins). */
export const teamApi = {
  list: () => request<TeamMember[]>("GET", "/team"),
  add: (input: TeamMemberInput) => request<TeamMember>("POST", "/team", { body: input }),
  setActive: (id: string, active: boolean) => request<TeamMember>("PATCH", `/team/${id}`, { body: { active } }),
};

export const settingsApi = {
  get: () => request<BusinessSettings>("GET", "/settings"),
  save: (values: Record<string, SettingValue>) => request<BusinessSettings>("PUT", "/settings", { body: { values } }),
};

export const supportApi = {
  listTickets: () => request<SupportTicket[]>("GET", "/support/tickets"),
  setStatus: (id: string, status: TicketStatus) => request<SupportTicket>("PATCH", `/support/tickets/${id}`, { body: { status } }),
};

export type AdminOrderQuery = { q?: string; status?: OrderStatus };
export const adminSearchApi = {
  orders: (query: AdminOrderQuery = {}) => request<Order[]>("GET", "/admin/orders", { query }),
  bookings: () => request<Booking[]>("GET", "/admin/bookings"),
  trips: () => request<TowingTrip[]>("GET", "/admin/trips"),
};

export const vendorReviewsApi = {
  listForVendor: () => request<Review[]>("GET", "/reviews/vendor"),
};

export const branchStockApi = {
  listBranchStock: () => request<BranchStock[]>("GET", "/inventory/branches"),
  setBranchStock: (id: string, onHand: number) => request<BranchStock>("PATCH", `/inventory/branches/${id}`, { body: { onHand } }),
};
