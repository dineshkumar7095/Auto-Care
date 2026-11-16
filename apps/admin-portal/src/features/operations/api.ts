import { queryOptions } from "@tanstack/react-query";
import { api, type AdminOrderQuery } from "@automotive/api-client";

export const adminOrdersQuery = (q: AdminOrderQuery) => queryOptions({ queryKey: ["admin", "orders", q], queryFn: () => api.admin.orders(q), placeholderData: (prev) => prev });
export const adminBookingsQuery = () => queryOptions({ queryKey: ["admin", "bookings"], queryFn: () => api.admin.bookings() });
export const adminTripsQuery = () => queryOptions({ queryKey: ["admin", "trips"], queryFn: () => api.admin.trips() });
