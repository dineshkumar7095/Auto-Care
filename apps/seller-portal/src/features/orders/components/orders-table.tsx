import { toast } from "sonner";
import { Can } from "@automotive/authentication";
import type { Order } from "@automotive/shared-types";
import { Badge } from "@automotive/shared-ui/ui/badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@automotive/shared-ui/ui/table";
import { formatINR } from "@automotive/utilities";
import { useUpdateOrderStatus } from "../api";
import { nextSellerAction, orderLabel, orderTone } from "../order-status";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const update = useUpdateOrderStatus();
  return (
    <div className="surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead className="hidden md:table-cell">Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => {
            const action = nextSellerAction(o.status);
            return (
              <TableRow key={o.id}>
                <TableCell>
                  <p className="font-semibold">{o.number}</p>
                  <p className="text-xs text-muted-foreground">{o.customerName}</p>
                  <Badge variant={o.channel === "B2B" ? "info" : "muted"} className="mt-1">{o.channel}</Badge>
                </TableCell>
                <TableCell className="hidden max-w-xs truncate text-sm md:table-cell">{o.lines.map((l) => `${l.title} × ${l.quantity}`).join(", ")}</TableCell>
                <TableCell className="font-semibold">{formatINR(o.totals.totalPaise)}</TableCell>
                <TableCell><StatusBadge label={orderLabel(o.status)} tone={orderTone[o.status]} /></TableCell>
                <TableCell className="text-right">
                  <Can permission="orders:fulfil" fallback={<span className="text-xs text-muted-foreground">View only</span>}>
                    {action ? (
                      <Button size="sm" disabled={update.isPending} onClick={() => update.mutate({ id: o.id, status: action.to })}>{action.label}</Button>
                    ) : o.status === "return_requested" ? (
                      <Button size="sm" variant="outline" onClick={() => toast("Return inspection opened")}>Review</Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </Can>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
