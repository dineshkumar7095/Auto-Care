import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { JOB_STAGE_LABEL } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { formatINR } from "@automotive/utilities";
import { jobsQuery } from "@/features/jobs/api";
import { invoiceable } from "@/features/jobs/job-rules";

export const Route = createFileRoute("/_portal/invoices")({ component: InvoicesPage });

function InvoicesPage() {
  const jobs = useQuery(jobsQuery());
  const list = jobs.data ? invoiceable(jobs.data) : [];
  return (
    <>
      <PageHeading title="Invoices" subtitle="Bills for finished jobs. Prices include 18% GST; extra work the customer didn't approve is left out." />
      {jobs.isPending ? <ListSkeleton /> : jobs.isError ? <ErrorState message={jobs.error.message} /> : !list.length ? <EmptyState title="No invoices yet" description="Jobs appear here once they're ready for pickup." /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {list.map(({ job, totalPaise, gstPaise }) => (
            <li key={job.id} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">INV-{job.number.replace(/^\D+-/, "")} · {job.customerName}</p>
                <p className="truncate text-xs text-muted-foreground">{job.vehicleLabel} · {job.registration}</p>
              </div>
              <div className="text-sm sm:text-right"><p className="font-semibold">{formatINR(totalPaise)}</p><p className="text-xs text-muted-foreground">incl. GST {formatINR(gstPaise)}</p></div>
              <StatusBadge label={job.stage === "delivered" ? "Paid" : JOB_STAGE_LABEL[job.stage]} tone={job.stage === "delivered" ? "success" : "info"} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
