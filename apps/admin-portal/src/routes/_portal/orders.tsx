import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, type OrderStatus } from "@automotive/shared-types";
import { OrderStatusBadge } from "@automotive/shared-ui/domain/order-status-badge";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { Input } from "@automotive/shared-ui/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@automotive/shared-ui/ui/select";
import { formatDateTime, formatINR } from "@automotive/utilities";
import { adminOrdersQuery } from "@/features/operations/api";

export const Route = createFileRoute("/_portal/orders")({ component: OrdersPage });

function OrdersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const orders = useQuery(adminOrdersQuery({ q: q.trim() || undefined, status: status === "all" ? undefined : status }));
  return (
    <>
      <PageHeading title="Orders" subtitle="Every parts order on the platform, retail and trade." />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Input aria-label="Search orders" placeholder="Order number or customer name" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-sm" />
        <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus | "all")}>
          <SelectTrigger aria-label="Filter by status" className="sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{ORDER_STATUS_LABEL[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {orders.isPending ? <ListSkeleton /> : orders.isError ? <ErrorState message={orders.error.message} /> : !orders.data.length ? <EmptyState title="No orders match" /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {orders.data.map((o) => (
            <li key={o.id} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{o.number} · {o.customerName}</p>
                <p className="truncate text-xs text-muted-foreground">{o.channel} · {o.lines.length} item{o.lines.length === 1 ? "" : "s"} · {formatDateTime(o.createdAt)}</p>
              </div>
              <span className="text-sm font-semibold">{formatINR(o.totals.totalPaise)}</span>
              <OrderStatusBadge status={o.status} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
