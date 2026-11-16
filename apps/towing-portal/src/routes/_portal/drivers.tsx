import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { maskPhone } from "@automotive/utilities";
import { tripsQuery } from "@/features/dispatch/api";
import { trucksQuery } from "@/features/trucks/api";

export const Route = createFileRoute("/_portal/drivers")({ component: DriversPage });

function DriversPage() {
  const trucks = useQuery(trucksQuery());
  const trips = useQuery(tripsQuery());
  const drivers = (trucks.data ?? []).filter((t) => t.driverName);
  return (
    <>
      <PageHeading title="Drivers" subtitle="Drivers use the Dono driver app to accept and update trips." />
      {trucks.isPending ? <ListSkeleton /> : (
        <div className="divide-y rounded-xl border bg-card">
          {drivers.map((t) => {
            const active = trips.data?.find((x) => x.driverName === t.driverName && !["completed", "cancelled"].includes(x.status));
            return (
              <div key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.driverName}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.registration}{active ? ` · on ${active.number}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={active ? "On a trip" : t.status === "maintenance" ? "Truck down" : "Free"} tone={active ? "info" : t.status === "maintenance" ? "danger" : "success"} />
                  {t.driverPhone && <a href={`tel:${t.driverPhone}`} aria-label={`Call ${t.driverName}`} className="hidden text-xs text-muted-foreground sm:inline"><Phone className="mr-1 inline size-3.5" />{maskPhone(t.driverPhone)}</a>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
