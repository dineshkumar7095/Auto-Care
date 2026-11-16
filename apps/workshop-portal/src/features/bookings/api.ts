import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const todaysBookingsQuery = () => queryOptions({ queryKey: ["bookings", "today"], queryFn: () => api.bookings.listToday() });
