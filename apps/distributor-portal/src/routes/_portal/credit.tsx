import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Progress } from "@automotive/shared-ui/ui/progress";
import { CREDIT_HOLD_OVERDUE_DAYS, creditAvailable, formatINR } from "@automotive/utilities";
import { creditQuery } from "@/features/credit/api";

export const Route = createFileRoute("/_portal/credit")({ component: CreditPage });

function CreditPage() {
  const credit = useQuery(creditQuery());
  const items = credit.data ?? [];
  return (
    <>
      <PageHeading title="Credit & terms" subtitle={`Buyers more than ${CREDIT_HOLD_OVERDUE_DAYS} days overdue are put on hold automatically.`} />
      <StatGrid
        stats={[
          { label: "Total limit", value: formatINR(items.reduce((s, a) => s + a.limitPaise, 0)) },
          { label: "Outstanding", value: formatINR(items.reduce((s, a) => s + a.usedPaise, 0)), tone: "warning", hint: "Across all buyers" },
          { label: "Over limit", value: String(items.filter((a) => a.usedPaise > a.limitPaise).length), tone: "danger" },
          { label: "On hold", value: String(items.filter((a) => a.overdueDays > CREDIT_HOLD_OVERDUE_DAYS).length), tone: "danger", hint: "Overdue payments" },
        ]}
      />
      <section className="mt-6">
        {credit.isPending ? <ListSkeleton /> : (
          <div className="divide-y rounded-xl border bg-card">
            {items.map((a) => {
              const used = Math.min(100, Math.round((a.usedPaise / a.limitPaise) * 100));
              const hold = a.overdueDays > CREDIT_HOLD_OVERDUE_DAYS;
              const over = a.usedPaise > a.limitPaise;
              return (
                <div key={a.id} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_14rem_auto] sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{a.buyerName}</p>
                    <p className="text-xs text-muted-foreground">{a.termsDays}-day terms · {formatINR(creditAvailable(a))} available</p>
                  </div>
                  <div>
                    <Progress value={used} aria-label={`${used}% of limit used`} />
                    <p className="mt-1 text-xs text-muted-foreground">{formatINR(a.usedPaise)} of {formatINR(a.limitPaise)}</p>
                  </div>
                  <div className="justify-self-start sm:justify-self-end">
                    {hold ? <StatusBadge label={`On hold · ${a.overdueDays} d overdue`} tone="danger" /> : over ? <StatusBadge label="Over limit" tone="danger" /> : a.overdueDays > 0 ? <StatusBadge label={`${a.overdueDays} d overdue`} tone="warning" /> : <StatusBadge label="Good standing" tone="success" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
