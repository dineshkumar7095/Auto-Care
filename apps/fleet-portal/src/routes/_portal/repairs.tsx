import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge, type StatusTone } from "@automotive/shared-ui/domain/status-badge";
import { formatINR } from "@automotive/utilities";
import type { ApprovalRequest } from "@automotive/shared-types";
import { approvalsQuery } from "@/features/approvals/api";
import { fleetVehiclesQuery } from "@/features/vehicles/api";

export const Route = createFileRoute("/_portal/repairs")({ component: RepairsPage });

const APPROVAL: Record<ApprovalRequest["status"], { label: string; tone: StatusTone }> = {
  pending: { label: "Waiting for you", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "neutral" },
};

function RepairsPage() {
  const vehicles = useQuery(fleetVehiclesQuery());
  const approvals = useQuery(approvalsQuery());
  const off = (vehicles.data ?? []).filter((v) => v.status === "in_service" || v.status === "breakdown");
  return (
    <>
      <PageHeading title="Repairs" subtitle="Vehicles off the road right now, and every repair cost raised for approval." />
      <section className="mb-6 space-y-2">
        <h2 className="font-display text-base font-semibold">Off the road</h2>
        {vehicles.isPending ? <ListSkeleton rows={2} /> : vehicles.isError ? <ErrorState message={vehicles.error.message} /> : !off.length ? <EmptyState title="All vehicles are running" /> : (
          <ul className="divide-y rounded-xl border bg-card">
            {off.map((v) => (
              <li key={v.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{v.registration}</p><p className="truncate text-xs text-muted-foreground">{v.model} · {v.odometerKm.toLocaleString("en-IN")} km</p></div>
                <StatusBadge label={v.status === "breakdown" ? "Broken down" : "At workshop"} tone={v.status === "breakdown" ? "danger" : "info"} />
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-base font-semibold">Repair costs</h2>
        {approvals.isPending ? <ListSkeleton rows={3} /> : approvals.isError ? <ErrorState message={approvals.error.message} /> : !approvals.data.length ? <EmptyState title="No repair costs yet" /> : (
          <ul className="divide-y rounded-xl border bg-card">
            {approvals.data.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{a.title}</p><p className="truncate text-xs text-muted-foreground">Raised by {a.requestedBy}</p></div>
                <span className="text-sm font-semibold">{formatINR(a.amountPaise)}</span>
                <StatusBadge label={APPROVAL[a.status].label} tone={APPROVAL[a.status].tone} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
