import type { TowingTrip, TripStatus } from "@automotive/shared-types";
import type { Tone } from "@automotive/mobile-kit/tone";
import { isLiveTrip } from "@automotive/utilities";

export const TRIP_TONE: Record<TripStatus, Tone> = { requested: "warning", accepted: "info", en_route: "info", arrived: "info", picked_up: "info", completed: "success", cancelled: "neutral" };

/** Driver's job list: their live trip first, then open requests, then finished trips. */
export function sortForDriver(trips: TowingTrip[], driverName: string) {
  const rank = (t: TowingTrip) => (t.driverName === driverName && isLiveTrip(t.status) ? 0 : t.status === "requested" ? 1 : 2);
  return [...trips].sort((a, b) => rank(a) - rank(b));
}

/** Google Maps directions link that works on Android and iOS. */
export const directionsUrl = (place: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${place}, Hyderabad`)}`;
