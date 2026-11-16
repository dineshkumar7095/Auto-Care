import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BatteryCharging, Truck } from "lucide-react";
import { Can } from "@automotive/authentication";
import { TRUCK_TYPE_LABEL } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { trucksQuery, useSetTruckStatus } from "@/features/trucks/api";
import { TRUCK_STATUS } from "@/features/trucks/truck-rules";

export const Route = createFileRoute("/_portal/trucks")({ component: TrucksPage });

function TrucksPage() {
  const trucks = useQuery(trucksQuery());
  const set = useSetTruckStatus();
  return (
    <>
      <PageHeading title="Trucks" subtitle="Only EV-safe flatbeds are offered for electric vehicles." />
      {trucks.isPending ? <ListSkeleton /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {trucks.data?.map((t) => (
            <article key={t.id} className="surface flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <Truck className="size-5 shrink-0 text-accent" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{t.registration}</p>
                    <p className="text-xs text-muted-foreground">{TRUCK_TYPE_LABEL[t.type]}{t.driverName ? ` · ${t.driverName}` : " · no driver"}</p>
                  </div>
                </div>
                <StatusBadge label={TRUCK_STATUS[t.status].label} tone={TRUCK_STATUS[t.status].tone} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                {t.evSafe ? <span className="flex items-center gap-1 text-xs font-medium text-success"><BatteryCharging className="size-4" /> EV-safe</span> : <span className="text-xs text-muted-foreground">Not for EVs</span>}
                <Can permission="towing:dispatch">
                  {t.status === "maintenance" ? (
                    <Button size="sm" variant="soft" disabled={set.isPending} onClick={() => set.mutate({ id: t.id, status: "available" })}>Back in service</Button>
                  ) : t.status === "available" ? (
                    <Button size="sm" variant="outline" disabled={set.isPending} onClick={() => set.mutate({ id: t.id, status: "maintenance" })}>Send to maintenance</Button>
                  ) : null}
                </Can>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
