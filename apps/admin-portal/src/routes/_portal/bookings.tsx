import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { adminBookingsQuery } from "@/features/operations/api";

export const Route = createFileRoute("/_portal/bookings")({ component: BookingsPage });

function BookingsPage() {
  const bookings = useQuery(adminBookingsQuery());
  return (
    <>
      <PageHeading title="Service bookings" subtitle="Workshop bookings across Hyderabad." />
      {bookings.isPending ? <ListSkeleton /> : bookings.isError ? <ErrorState message={bookings.error.message} /> : !bookings.data.length ? <EmptyState title="No bookings" /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {bookings.data.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{b.service} · {b.customerName}</p>
                <p className="truncate text-xs text-muted-foreground">{b.vehicleLabel} · {b.slot}</p>
              </div>
              <StatusBadge label={b.source === "marketplace" ? "Booked online" : "Walk-in"} tone={b.source === "marketplace" ? "info" : "neutral"} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
