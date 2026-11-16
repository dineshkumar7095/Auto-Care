import type { FleetVehicle } from "@automotive/shared-types";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Badge } from "@automotive/shared-ui/ui/badge";
import { isServiceDue, VEHICLE_STATUS } from "../vehicle-rules";

export function VehicleList({ vehicles }: { vehicles: FleetVehicle[] }) {
  return (
    <div className="divide-y rounded-xl border bg-card">
      {vehicles.map((v) => (
        <div key={v.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{v.registration} · {v.model}</p>
            <p className="truncate text-xs text-muted-foreground">{v.odometerKm.toLocaleString("en-IN")} km · {v.driver ?? "No driver"}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge {...VEHICLE_STATUS[v.status]} />
            {isServiceDue(v) && <Badge variant="warning">Service due</Badge>}
          </div>
        </div>
      ))}
    </div>
  );
}
