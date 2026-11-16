import { Can } from "@automotive/authentication";
import { ORDER_TRANSITIONS, type Order } from "@automotive/shared-types";
import { OrderStatusBadge } from "@automotive/shared-ui/domain/order-status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatINR } from "@automotive/utilities";
import { useAdvanceTradeOrder } from "../api";

export function TradeOrderList({ orders }: { orders: Order[] }) {
  const advance = useAdvanceTradeOrder();
  return (
    <div className="divide-y rounded-xl border bg-card">
      {orders.map((o) => {
        const next = ORDER_TRANSITIONS[o.status].find((s) => s !== "cancelled");
        const units = o.lines.reduce((s, l) => s + l.quantity, 0);
        return (
          <div key={o.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 sm:flex sm:flex-wrap">
            <div className="min-w-0 sm:flex-1">
              <p className="truncate text-sm font-semibold">{o.number} · {o.customerName}</p>
              <p className="truncate text-xs text-muted-foreground">{o.lines.length} SKUs · {units} units</p>
            </div>
            <span className="text-right font-semibold sm:order-none">{formatINR(o.totals.totalPaise)}</span>
            <OrderStatusBadge status={o.status} />
            <Can permission="orders:fulfil">
              {next && next !== "delivered" && next !== "return_requested" ? (
                <Button size="sm" variant="soft" className="justify-self-end" disabled={advance.isPending} onClick={() => advance.mutate({ id: o.id, status: next })}>
                  Mark {next}
                </Button>
              ) : <span />}
            </Can>
          </div>
        );
      })}
    </div>
  );
}
