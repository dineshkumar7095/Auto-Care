import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TOWING_ISSUE_LABEL, TRIP_STATUS_LABEL } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { formatINR, isLiveTrip } from "@automotive/utilities";
import { adminTripsQuery } from "@/features/operations/api";

export const Route = createFileRoute("/_portal/trips")({ component: TripsPage });

function TripsPage() {
  const trips = useQuery(adminTripsQuery());
  return (
    <>
      <PageHeading title="Towing trips" subtitle="Live and recent towing jobs. In an emergency, customers are always shown 112 first." />
      {trips.isPending ? <ListSkeleton /> : trips.isError ? <ErrorState message={trips.error.message} /> : !trips.data.length ? <EmptyState title="No trips" /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {trips.data.map((t) => (
            <li key={t.id} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{t.number} · {t.customerName} · {TOWING_ISSUE_LABEL[t.issue]}</p>
                <p className="truncate text-xs text-muted-foreground">{t.pickup} → {t.drop}{t.driverName ? ` · ${t.driverName}` : " · no driver yet"}</p>
              </div>
              <span className="text-sm font-semibold">{formatINR(t.quotedPaise)}</span>
              <StatusBadge label={TRIP_STATUS_LABEL[t.status]} tone={isLiveTrip(t.status) ? "warning" : t.status === "completed" ? "success" : "neutral"} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
