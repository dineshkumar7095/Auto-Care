import { TRIP_STATUS_LABEL, type TripStatus } from "@automotive/shared-types";
import type { StatusTone } from "@automotive/shared-ui/domain/status-badge";
import { isLiveTrip, nextTripAction } from "@automotive/utilities";

export const TRIP_LABEL = TRIP_STATUS_LABEL;
export const tripTone: Record<TripStatus, StatusTone> = { requested: "warning", accepted: "info", en_route: "info", arrived: "info", picked_up: "info", completed: "success", cancelled: "neutral" };
export { nextTripAction };
export const isLive = isLiveTrip;
