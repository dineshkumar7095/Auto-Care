import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TOWING_ISSUE_LABEL } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { formatINR } from "@automotive/utilities";
import { tripsQuery } from "@/features/dispatch/api";
import { TRIP_LABEL, tripTone } from "@/features/dispatch/trip-rules";

export const Route = createFileRoute("/_portal/trips")({ component: TripHistory });

function TripHistory() {
  const trips = useQuery(tripsQuery());
  return (
    <>
      <PageHeading title="Trip history" subtitle="All trips for your company." />
      {trips.isPending ? <ListSkeleton /> : (
        <div className="divide-y rounded-xl border bg-card">
          {trips.data?.map((t) => (
            <div key={t.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{t.number} · {TOWING_ISSUE_LABEL[t.issue]}</p>
                <p className="truncate text-xs text-muted-foreground">{t.pickup} → {t.drop}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge label={TRIP_LABEL[t.status]} tone={tripTone[t.status]} />
                <span className="text-xs font-semibold">{formatINR(t.quotedPaise)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
