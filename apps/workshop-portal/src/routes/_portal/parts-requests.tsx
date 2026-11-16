import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { formatINR } from "@automotive/utilities";
import { jobsQuery } from "@/features/jobs/api";
import { partRequests } from "@/features/jobs/job-rules";

export const Route = createFileRoute("/_portal/parts-requests")({ component: PartsRequestsPage });

function PartsRequestsPage() {
  const jobs = useQuery(jobsQuery());
  const list = jobs.data ? partRequests(jobs.data) : [];
  return (
    <>
      <PageHeading title="Parts requests" subtitle="Parts needed for open job cards. Order only after the customer approves." />
      {jobs.isPending ? <ListSkeleton /> : jobs.isError ? <ErrorState message={jobs.error.message} /> : !list.length ? <EmptyState title="No parts needed right now" description="Part lines on job cards in diagnosis or repair show up here." /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {list.map((p, i) => (
            <li key={`${p.jobId}-${i}`} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.label}</p>
                <p className="truncate text-xs text-muted-foreground">{p.jobNumber} · {p.registration}</p>
              </div>
              <span className="text-sm font-semibold">{formatINR(p.amountPaise)}</span>
              <StatusBadge label={p.approved ? "Approved · order now" : "Waiting for customer"} tone={p.approved ? "success" : "warning"} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
