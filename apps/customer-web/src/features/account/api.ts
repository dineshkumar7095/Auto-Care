import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const myOrdersQuery = () => queryOptions({ queryKey: ["orders", "mine"], queryFn: () => api.orders.listMine() });
