import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Can } from "@automotive/authentication";
import { RETURN_REASON_LABEL, type ReturnStatus } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge, type StatusTone } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatDate, formatINR } from "@automotive/utilities";
import { allReturnsQuery, useAdminReturnDecision } from "@/features/refunds/api";

export const Route = createFileRoute("/_portal/refunds")({ component: RefundsPage });

const TONE: Record<ReturnStatus, StatusTone> = { requested: "warning", approved: "info", rejected: "neutral", refunded: "success" };
const LABEL: Record<ReturnStatus, string> = { requested: "Seller deciding", approved: "Ready to refund", rejected: "Rejected", refunded: "Refunded" };

function RefundsPage() {
  const returns = useQuery(allReturnsQuery());
  const decide = useAdminReturnDecision();
  return (
    <>
      <PageHeading title="Returns & refunds" subtitle="Sellers approve returns first. Finance releases the refund to the customer's original payment method." />
      {returns.isPending ? <ListSkeleton /> : !returns.data?.length ? <EmptyState title="No returns" /> : (
        <div className="divide-y rounded-xl border bg-card">
          {returns.data.map((r) => (
            <div key={r.id} className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.orderNumber} · {r.customerName}</p>
                <p className="truncate text-xs text-muted-foreground">{RETURN_REASON_LABEL[r.reason]} · {formatINR(r.amountPaise)} · {formatDate(r.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={LABEL[r.status]} tone={TONE[r.status]} />
                <Can permission="refunds:approve">
                  {r.status === "approved" && <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate({ id: r.id, decision: "refund" })}>Release refund</Button>}
                  {r.status === "requested" && <Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => decide.mutate({ id: r.id, decision: "approve" })}>Approve for seller</Button>}
                </Can>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
