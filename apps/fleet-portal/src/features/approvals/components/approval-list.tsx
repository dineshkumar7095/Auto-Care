import { Can } from "@automotive/authentication";
import type { ApprovalRequest } from "@automotive/shared-types";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatINR } from "@automotive/utilities";
import { useDecideApproval } from "../api";

export function ApprovalList({ items }: { items: ApprovalRequest[] }) {
  const decide = useDecideApproval();
  return (
    <div className="space-y-3">
      {items.map((a) => (
        <div key={a.id} className="surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{a.title}</p>
            <p className="text-xs text-muted-foreground">Requested by {a.requestedBy}</p>
          </div>
          <span className="font-display font-semibold">{formatINR(a.amountPaise)}</span>
          {a.status === "pending" ? (
            <Can permission="fleet:approve">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => decide.mutate({ id: a.id, decision: "reject" })}>Reject</Button>
                <Button size="sm" onClick={() => decide.mutate({ id: a.id, decision: "approve" })}>Approve</Button>
              </div>
            </Can>
          ) : (
            <StatusBadge label={a.status} tone={a.status === "approved" ? "success" : "neutral"} />
          )}
        </div>
      ))}
    </div>
  );
}
