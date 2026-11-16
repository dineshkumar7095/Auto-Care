import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const myPayoutsQuery = () => queryOptions({ queryKey: ["payouts", "mine"], queryFn: () => api.payouts.listMine() });
