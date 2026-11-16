import type { TowTruck, TowingTrip } from "@automotive/shared-types";
import type { StatusTone } from "@automotive/shared-ui/domain/status-badge";

export const TRUCK_STATUS: Record<TowTruck["status"], { label: string; tone: StatusTone }> = {
  available: { label: "Available", tone: "success" },
  on_trip: { label: "On a trip", tone: "info" },
  maintenance: { label: "In maintenance", tone: "danger" },
};

/** EV trips need an EV-safe flatbed; anything else can take any available truck. */
export const trucksForTrip = (trucks: TowTruck[], trip: Pick<TowingTrip, "issue">) =>
  trucks.filter((t) => t.status === "available" && (trip.issue !== "ev_support" || t.evSafe));
