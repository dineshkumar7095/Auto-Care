import { Check, FileWarning, X } from "lucide-react";
import { Can } from "@automotive/authentication";
import type { Vendor } from "@automotive/shared-types";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Badge } from "@automotive/shared-ui/ui/badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { canApprove, riskTone, VENDOR_TYPE_LABEL } from "../partner-rules";

export function PartnerCard({ vendor, onDecide }: { vendor: Vendor; onDecide: (decision: "approve" | "reject") => void }) {
  const approvable = canApprove(vendor);
  return (
    <article className="surface flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate font-sans text-base font-semibold">{vendor.name}</h2>
          <p className="text-sm text-muted-foreground">{vendor.city}</p>
        </div>
        <Badge variant="info" className="shrink-0">{VENDOR_TYPE_LABEL[vendor.type]}</Badge>
      </div>
      <ul className="space-y-1.5 text-sm">
        {vendor.documents.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            {d.verified ? <Check className="size-4 shrink-0 text-success" /> : <FileWarning className="size-4 shrink-0 text-destructive" />}
            <span className={d.verified ? "" : "text-destructive"}>{d.label}{!d.verified && " — missing"}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">Risk <StatusBadge label={vendor.risk} tone={riskTone[vendor.risk]} /></div>
      <Can permission="partners:approve" fallback={<p className="mt-auto border-t pt-3 text-xs text-muted-foreground">Only operations admins can decide.</p>}>
        <div className="mt-auto flex gap-2 border-t pt-3">
          <Button variant="outline" className="flex-1" onClick={() => onDecide("reject")}><X /> Reject</Button>
          <Button className="flex-1" disabled={!approvable} onClick={() => onDecide("approve")}><Check /> Approve</Button>
        </div>
        {!approvable && <p className="-mt-1 text-xs text-muted-foreground">Approval unlocks once all documents are verified.</p>}
      </Can>
    </article>
  );
}
