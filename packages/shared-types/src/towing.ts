export const TOWING_ISSUES = ["breakdown", "accident_recovery", "flat_tyre", "battery", "fuel", "lockout", "winch", "ev_support"] as const;
export type TowingIssue = (typeof TOWING_ISSUES)[number];

export const TOWING_ISSUE_LABEL: Record<TowingIssue, string> = {
  breakdown: "Breakdown",
  accident_recovery: "Accident recovery",
  flat_tyre: "Flat tyre",
  battery: "Battery jump-start",
  fuel: "Out of fuel",
  lockout: "Locked out",
  winch: "Winch / recovery",
  ev_support: "EV support",
};

export const TRIP_STATUSES = ["requested", "accepted", "en_route", "arrived", "picked_up", "completed", "cancelled"] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];

export const TRIP_TRANSITIONS: Record<TripStatus, readonly TripStatus[]> = {
  requested: ["accepted", "cancelled"],
  accepted: ["en_route", "cancelled"],
  en_route: ["arrived"],
  arrived: ["picked_up", "completed"],
  picked_up: ["completed"],
  completed: [],
  cancelled: [],
};

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  requested: "New request",
  accepted: "Accepted",
  en_route: "On the way",
  arrived: "Arrived",
  picked_up: "Vehicle picked up",
  completed: "Completed",
  cancelled: "Cancelled",
};

export type TowingProvider = { id: string; name: string; etaMin: number; distanceKm: number; truck: string; evSafe: boolean; pricePaise: number; rating: number };

export type TowingTrip = {
  id: string;
  number: string;
  customerName: string;
  issue: TowingIssue;
  pickup: string;
  drop: string;
  providerId: string | null;
  driverName: string | null;
  status: TripStatus;
  etaMin: number | null;
  quotedPaise: number;
};

export const TRUCK_TYPES = ["flatbed", "wheel_lift", "heavy_duty", "two_wheeler"] as const;
export type TruckType = (typeof TRUCK_TYPES)[number];
export const TRUCK_TYPE_LABEL: Record<TruckType, string> = { flatbed: "Flatbed", wheel_lift: "Wheel-lift", heavy_duty: "Heavy-duty", two_wheeler: "Two-wheeler carrier" };

export type TowTruck = {
  id: string;
  vendorId: string;
  registration: string;
  type: TruckType;
  /** Flatbeds rated for EVs — required for ev_support trips. */
  evSafe: boolean;
  driverName: string | null;
  driverPhone: string | null;
  status: "available" | "on_trip" | "maintenance";
};
