import type { TowTruck, TowingIssue, TowingProvider, TowingTrip, TripStatus } from "@automotive/shared-types";
import { request } from "../http";

export const towingApi = {
  listProviders: (query: { issue?: TowingIssue } = {}) => request<TowingProvider[]>("GET", "/towing/providers", { query }),
  requestTrip: (input: { issue: TowingIssue; pickup: string; drop: string; vehicleLabel: string; providerId?: string }) => request<TowingTrip>("POST", "/towing/requests", { body: input }),
  listTrips: () => request<TowingTrip[]>("GET", "/towing/trips"),
  updateTripStatus: (id: string, status: TripStatus) => request<TowingTrip>("PATCH", `/towing/trips/${id}/status`, { body: { status } }),
  listTrucks: () => request<TowTruck[]>("GET", "/towing/trucks"),
  setTruckStatus: (id: string, status: TowTruck["status"]) => request<TowTruck>("PATCH", `/towing/trucks/${id}`, { body: { status } }),
};
