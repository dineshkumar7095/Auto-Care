import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Car, LogOut } from "lucide-react";
import { useAuth } from "@automotive/authentication";
import { OrderStatusBadge } from "@automotive/shared-ui/domain/order-status-badge";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { usePageTitle } from "@automotive/shared-ui/lib/use-page-title";
import { Button } from "@automotive/shared-ui/ui/button";
import { NotificationList } from "@automotive/shared-ui/domain/notification-list";
import { StatusBadge, type StatusTone } from "@automotive/shared-ui/domain/status-badge";
import { RETURN_REASON_LABEL, type ReturnStatus } from "@automotive/shared-types";
import { canRequestReturn, formatINR, maskPhone } from "@automotive/utilities";
import { notificationsQuery, useMarkRead } from "@/features/notifications/api";
import { myReturnsQuery } from "@/features/returns/api";
import { InvoiceDialog } from "@/features/returns/components/invoice-dialog";
import { ReturnDialog } from "@/features/returns/components/return-dialog";
import { myOrdersQuery } from "@/features/account/api";
import { savedVehicles } from "@/features/vehicles/saved-vehicles";

const RETURN_LABEL: Record<ReturnStatus, { label: string; tone: StatusTone }> = {
  requested: { label: "With seller", tone: "warning" },
  approved: { label: "Approved · refund on the way", tone: "info" },
  rejected: { label: "Not accepted", tone: "neutral" },
  refunded: { label: "Refunded", tone: "success" },
};

export const Route = createFileRoute("/_site/_account/account")({ component: AccountPage });

function AccountPage() {
  usePageTitle("My account — Dono Auto Care");
  const auth = useAuth();
  const orders = useQuery(myOrdersQuery());
  const returns = useQuery(myReturnsQuery());
  const notes = useQuery(notificationsQuery());
  const markRead = useMarkRead();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold">Hi, {auth.user?.name.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">{auth.user ? maskPhone(auth.user.phone) : ""}</p>
        </div>
        <Button variant="outline" onClick={auth.signOut}><LogOut /> Sign out</Button>
      </div>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">My vehicles</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {savedVehicles.map((v) => (
            <div key={v.id} className="surface flex items-center gap-3 p-4">
              <Car className="size-5 shrink-0 text-accent" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{v.label}</p>
                <p className="text-xs text-muted-foreground">{v.reg}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">My orders</h2>
        {orders.isPending ? <ListSkeleton /> : orders.data?.length ? (
          <div className="divide-y rounded-xl border bg-card">
            {orders.data.map((o) => (
              <div key={o.id} className="grid gap-2 p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{o.number}</p>
                    <p className="truncate text-xs text-muted-foreground">{o.lines.map((l) => l.title).join(", ")}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <OrderStatusBadge status={o.status} />
                    <span className="text-xs font-semibold">{formatINR(o.totals.totalPaise)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <InvoiceDialog orderId={o.id} orderNumber={o.number} />
                  {canRequestReturn(o) && <ReturnDialog order={o} />}
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState title="No orders yet" />}
      </section>
      {!!returns.data?.length && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">My returns</h2>
          <div className="divide-y rounded-xl border bg-card">
            {returns.data.map((r) => (
              <div key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{r.orderNumber} · {formatINR(r.amountPaise)}</p>
                  <p className="truncate text-xs text-muted-foreground">{RETURN_REASON_LABEL[r.reason]}</p>
                </div>
                <StatusBadge label={RETURN_LABEL[r.status].label} tone={RETURN_LABEL[r.status].tone} />
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Notifications</h2>
        {notes.isPending ? <ListSkeleton rows={2} /> : <NotificationList items={notes.data ?? []} onRead={(id) => markRead.mutate(id)} />}
      </section>
    </div>
  );
}
