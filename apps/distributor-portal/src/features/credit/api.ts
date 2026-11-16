import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const creditQuery = () => queryOptions({ queryKey: ["trade", "credit"], queryFn: () => api.trade.listCredit() });
