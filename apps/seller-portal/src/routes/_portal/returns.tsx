import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Can } from "@automotive/authentication";
import { RETURN_REASON_LABEL } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatDate, formatINR } from "@automotive/utilities";
import { useDecideReturn, vendorReturnsQuery } from "@/features/returns/api";
import { RETURN_STATUS } from "@/features/returns/return-status";

export const Route = createFileRoute("/_portal/returns")({ component: ReturnsPage });

function ReturnsPage() {
  const returns = useQuery(vendorReturnsQuery());
  const decide = useDecideReturn();
  return (
    <>
      <PageHeading title="Returns" subtitle="Approve or reject within 48 hours. Dono finance releases the refund after you approve." />
      {returns.isPending ? <ListSkeleton /> : !returns.data?.length ? <EmptyState title="No returns" description="Nice — nobody has sent anything back." /> : (
        <div className="divide-y rounded-xl border bg-card">
          {returns.data.map((r) => (
            <div key={r.id} className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.orderNumber} · {r.customerName} · {formatINR(r.amountPaise)}</p>
                <p className="text-sm">{RETURN_REASON_LABEL[r.reason]}{r.note ? ` — “${r.note}”` : ""}</p>
                <p className="text-xs text-muted-foreground">Asked {formatDate(r.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={RETURN_STATUS[r.status].label} tone={RETURN_STATUS[r.status].tone} />
                {r.status === "requested" && (
                  <Can permission="orders:fulfil">
                    <Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => decide.mutate({ id: r.id, decision: "reject" })}>Reject</Button>
                    <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate({ id: r.id, decision: "approve" })}>Approve</Button>
                  </Can>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
