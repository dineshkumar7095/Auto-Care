import { useState } from "react";
import { Clock } from "lucide-react";
import { Can } from "@automotive/authentication";
import { BUYER_GROUP_LABEL, type Rfq } from "@automotive/shared-types";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { Input } from "@automotive/shared-ui/ui/input";
import { Label } from "@automotive/shared-ui/ui/label";
import { canQuoteRfq, formatINR, rupeesToPaise } from "@automotive/utilities";
import { useQuoteRfq } from "../api";
import { RFQ_STATUS, hoursLeft, suggestedQuotePaise } from "../rfq-rules";

export function RfqCard({ rfq }: { rfq: Rfq }) {
  const quote = useQuoteRfq();
  const suggested = suggestedQuotePaise(rfq);
  const [rupees, setRupees] = useState(suggested ? String(suggested / 100) : "");
  const status = RFQ_STATUS[rfq.status];
  const open = canQuoteRfq(rfq);
  const amount = Number(rupees);
  return (
    <article className="surface flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">{rfq.number} · {BUYER_GROUP_LABEL[rfq.buyerType]}</p>
          <h3 className="truncate font-sans text-base font-semibold">{rfq.buyerName}</h3>
        </div>
        <StatusBadge label={status.label} tone={status.tone} />
      </div>
      <ul className="space-y-1 text-sm">
        {rfq.lines.map((l) => (
          <li key={l.partNumber} className="flex justify-between gap-3">
            <span className="min-w-0 truncate">{l.quantity} × {l.title}</span>
            <span className="shrink-0 text-muted-foreground">{l.targetUnitPaise ? `target ${formatINR(l.targetUnitPaise)}` : "no target"}</span>
          </li>
        ))}
      </ul>
      {open ? (
        <Can permission="orders:fulfil" fallback={<p className="text-sm text-muted-foreground">Only sales staff can quote.</p>}>
          <form
            className="flex flex-wrap items-end gap-2 border-t pt-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (amount > 0) quote.mutate({ id: rfq.id, totalPaise: rupeesToPaise(amount) });
            }}
          >
            <div className="min-w-0 flex-1">
              <Label htmlFor={`q-${rfq.id}`} className="text-xs">Your total quote (₹, incl. GST)</Label>
              <Input id={`q-${rfq.id}`} inputMode="decimal" value={rupees} onChange={(e) => setRupees(e.target.value.replace(/[^\d.]/g, ""))} placeholder="e.g. 58000" />
            </div>
            <Button type="submit" disabled={!(amount > 0) || quote.isPending}>Send quote</Button>
            <p className="flex w-full items-center gap-1 text-xs text-warning-foreground"><Clock className="size-3.5" /> {hoursLeft(rfq.expiresAt)} h left to quote</p>
          </form>
        </Can>
      ) : (
        <p className="border-t pt-3 text-sm">{rfq.quotedTotalPaise ? <>Quoted <b>{formatINR(rfq.quotedTotalPaise)}</b></> : "Closed without a quote"}</p>
      )}
    </article>
  );
}
