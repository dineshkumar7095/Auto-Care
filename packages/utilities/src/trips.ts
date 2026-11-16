import { TRIP_TRANSITIONS, type TripStatus } from "@automotive/shared-types";

const ACTION: Partial<Record<TripStatus, string>> = { accepted: "Accept job", en_route: "Start driving", arrived: "Mark arrived", picked_up: "Vehicle loaded", completed: "Complete trip" };

/** Next forward step for a towing trip (never cancel). Shared by the towing portal and the driver app. */
export const nextTripAction = (status: TripStatus) => {
  const to = TRIP_TRANSITIONS[status].find((s) => s !== "cancelled");
  return to ? { to, label: ACTION[to] ?? to } : null;
};
export const isLiveTrip = (s: TripStatus) => s !== "completed" && s !== "cancelled";
