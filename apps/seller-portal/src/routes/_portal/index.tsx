import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Plus } from "lucide-react";
import { useAuth } from "@automotive/authentication";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatINR } from "@automotive/utilities";
import { vendorOrdersQuery } from "@/features/orders/api";
import { orderLabel, orderTone } from "@/features/orders/order-status";
import { myListingsQuery } from "@/features/products/api";
import { isLowStock } from "@/features/products/listing-status";

export const Route = createFileRoute("/_portal/")({ component: SellerDashboard });

function SellerDashboard() {
  const auth = useAuth();
  const orders = useQuery(vendorOrdersQuery());
  const listings = useQuery(myListingsQuery());
  const newOrders = orders.data?.filter((o) => o.status === "placed") ?? [];
  const lowStock = listings.data?.filter(isLowStock) ?? [];
  const todaysValue = orders.data?.reduce((s, o) => s + o.totals.totalPaise, 0) ?? 0;

  return (
    <>
      <PageHeading
        title={`Good afternoon, ${auth.user?.name.split(" ")[0] ?? ""}`}
        subtitle="Here's what needs your attention today."
        actions={<Button asChild><Link to="/products"><Plus /> Add product</Link></Button>}
      />
      <StatGrid
        stats={[
          { label: "Open order value", value: formatINR(todaysValue), hint: "+18% vs last Friday", tone: "success" },
          { label: "Orders to accept", value: String(newOrders.length), hint: "Accept within 30 min", tone: "warning" },
          { label: "Next payout", value: formatINR(18240000), hint: "Mon, 16 Nov" },
          { label: "Seller rating", value: "4.7 ★", hint: "98% on-time dispatch", tone: "success" },
        ]}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link to="/orders" className="flex items-center gap-1 text-sm font-medium text-accent">All orders <ArrowRight className="size-4" /></Link>
          </div>
          {orders.isPending ? <ListSkeleton /> : (
            <div className="divide-y">
              {orders.data?.slice(0, 5).map((o) => (
                <div key={o.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{o.number} <span className="font-normal text-muted-foreground">· {o.customerName}</span></p>
                    <p className="truncate text-xs text-muted-foreground">{o.lines.map((l) => l.title).join(", ")}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatINR(o.totals.totalPaise)}</span>
                  <StatusBadge label={orderLabel(o.status)} tone={orderTone[o.status]} />
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="surface h-fit p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><AlertTriangle className="size-5 text-warning" /> Low stock</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {lowStock.map((l) => (
              <li key={l.id} className="flex justify-between gap-2">
                <span className="truncate">{l.title}</span>
                <span className="font-semibold text-destructive">{l.stock} left</span>
              </li>
            ))}
            {!lowStock.length && <li className="text-muted-foreground">Nothing running low.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
