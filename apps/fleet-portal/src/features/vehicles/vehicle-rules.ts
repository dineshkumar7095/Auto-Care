import type { FleetVehicle } from "@automotive/shared-types";
import type { StatusTone } from "@automotive/shared-ui/domain/status-badge";

export const VEHICLE_STATUS: Record<FleetVehicle["status"], { label: string; tone: StatusTone }> = {
  active: { label: "On the road", tone: "success" },
  in_service: { label: "In service", tone: "info" },
  breakdown: { label: "Breakdown", tone: "danger" },
  idle: { label: "Idle", tone: "neutral" },
};
/** Due when within 1,000 km of (or past) the next service. */
export const isServiceDue = (v: Pick<FleetVehicle, "odometerKm" | "nextServiceKm">) => v.nextServiceKm - v.odometerKm <= 1000;
