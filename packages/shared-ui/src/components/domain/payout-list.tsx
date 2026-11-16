import type { Payout, PayoutStatus } from "@automotive/shared-types";
import { formatDate, formatINR } from "@automotive/utilities";
import type { ReactNode } from "react";
import { StatusBadge, type StatusTone } from "./status-badge";

const STATUS: Record<PayoutStatus, { label: string; tone: StatusTone }> = {
  scheduled: { label: "Scheduled", tone: "info" },
  paid: { label: "Paid", tone: "success" },
  on_hold: { label: "On hold", tone: "danger" },
};

/** Settlement breakdown used by every partner portal and by admin finance. */
export function PayoutList({ payouts, showVendor = false, action }: { payouts: Payout[]; showVendor?: boolean; action?: (p: Payout) => ReactNode }) {
  return (
    <div className="divide-y rounded-xl border bg-card">
      {payouts.map((p) => (
        <div key={p.id} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{showVendor ? p.vendorName : p.periodLabel}</p>
            <p className="text-xs text-muted-foreground">{showVendor ? `${p.periodLabel} · ` : ""}{p.status === "paid" ? "Paid" : "Due"} {formatDate(p.payoutDate)}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:grid-cols-4">
            <div><dt className="text-muted-foreground">Sales</dt><dd className="font-medium">{formatINR(p.grossPaise)}</dd></div>
            <div><dt className="text-muted-foreground">Commission</dt><dd className="font-medium">−{formatINR(p.commissionPaise)}</dd></div>
            <div><dt className="text-muted-foreground">TDS + refunds</dt><dd className="font-medium">−{formatINR(p.tdsPaise + p.refundsPaise)}</dd></div>
            <div><dt className="text-muted-foreground">You get</dt><dd className="font-semibold text-foreground">{formatINR(p.netPaise)}</dd></div>
          </dl>
          <div className="flex items-center gap-2 md:justify-self-end">
            <StatusBadge label={STATUS[p.status].label} tone={STATUS[p.status].tone} />
            {action?.(p)}
          </div>
        </div>
      ))}
    </div>
  );
}
