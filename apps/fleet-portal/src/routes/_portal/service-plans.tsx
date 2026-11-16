import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Progress } from "@automotive/shared-ui/ui/progress";
import { fleetVehiclesQuery } from "@/features/vehicles/api";
import { isServiceDue } from "@/features/vehicles/vehicle-rules";

export const Route = createFileRoute("/_portal/service-plans")({ component: ServicePlansPage });

const INTERVAL_KM = 10_000;

function ServicePlansPage() {
  const vehicles = useQuery(fleetVehiclesQuery());
  const sorted = [...(vehicles.data ?? [])].sort((a, b) => a.nextServiceKm - a.odometerKm - (b.nextServiceKm - b.odometerKm));
  return (
    <>
      <PageHeading title="Service plans" subtitle={`Every vehicle is serviced every ${INTERVAL_KM.toLocaleString("en-IN")} km. Closest due first.`} />
      {vehicles.isPending ? <ListSkeleton /> : (
        <div className="divide-y rounded-xl border bg-card">
          {sorted.map((v) => {
            const left = v.nextServiceKm - v.odometerKm;
            const pct = Math.min(100, Math.max(0, Math.round(((INTERVAL_KM - left) / INTERVAL_KM) * 100)));
            return (
              <div key={v.id} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_14rem_auto] sm:items-center sm:gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{v.registration}</p>
                  <p className="truncate text-xs text-muted-foreground">{v.model} · {v.odometerKm.toLocaleString("en-IN")} km</p>
                </div>
                <div>
                  <Progress value={pct} aria-label={`${pct}% of service interval used`} />
                  <p className="mt-1 text-xs text-muted-foreground">Next at {v.nextServiceKm.toLocaleString("en-IN")} km</p>
                </div>
                <div className="sm:justify-self-end">
                  {left < 0 ? <StatusBadge label={`Overdue ${Math.abs(left).toLocaleString("en-IN")} km`} tone="danger" /> : isServiceDue(v) ? <StatusBadge label={`Due in ${left.toLocaleString("en-IN")} km`} tone="warning" /> : <StatusBadge label={`${left.toLocaleString("en-IN")} km left`} tone="success" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
