import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { todaysBookingsQuery } from "@/features/bookings/api";
import { BookingsList } from "@/features/bookings/components/bookings-list";

export const Route = createFileRoute("/_portal/bookings")({ component: BookingsPage });

function BookingsPage() {
  const bookings = useQuery(todaysBookingsQuery());
  return (
    <>
      <PageHeading title="Bookings" subtitle="Today's appointments from the marketplace and walk-ins." />
      <section className="surface p-5">
        {bookings.isPending ? <ListSkeleton /> : bookings.data?.length ? <BookingsList bookings={bookings.data} /> : <EmptyState title="No bookings today" />}
      </section>
    </>
  );
}
