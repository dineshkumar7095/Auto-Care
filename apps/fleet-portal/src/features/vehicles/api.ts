import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";

export const fleetVehiclesQuery = () => queryOptions({ queryKey: ["fleet", "vehicles"], queryFn: () => api.fleet.listVehicles() });
