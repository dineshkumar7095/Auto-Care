import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const fleetSpendQuery = () => queryOptions({ queryKey: ["fleet", "spend"], queryFn: () => api.fleet.spend() });
