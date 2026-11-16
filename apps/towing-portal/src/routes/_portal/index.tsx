import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { tripsQuery } from "@/features/dispatch/api";
import { TripCard } from "@/features/dispatch/components/trip-card";
import { isLive } from "@/features/dispatch/trip-rules";

export const Route = createFileRoute("/_portal/")({ component: LiveJobs });

function LiveJobs() {
  const trips = useQuery(tripsQuery());
  const live = trips.data?.filter((t) => isLive(t.status)) ?? [];
  return (
    <>
      <PageHeading title="Live jobs" subtitle="New requests near you and trips in progress. Updates every 15 seconds." />
      <StatGrid
        stats={[
          { label: "New requests", value: String(live.filter((t) => t.status === "requested").length), tone: "warning", hint: "Accept within 2 min" },
          { label: "Trips in progress", value: String(live.filter((t) => t.status !== "requested").length) },
          { label: "Avg. arrival today", value: "21 min", tone: "success", hint: "Target 25 min" },
          { label: "Trucks free", value: "2 of 4" },
        ]}
      />
      <div className="mt-6">
        {trips.isPending ? <ListSkeleton /> : live.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{live.map((t) => <TripCard key={t.id} trip={t} />)}</div>
        ) : <EmptyState title="No live jobs" description="New requests will appear here." />}
      </div>
    </>
  );
}
