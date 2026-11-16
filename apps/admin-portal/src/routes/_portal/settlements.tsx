import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Can } from "@automotive/authentication";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { PayoutList } from "@automotive/shared-ui/domain/payout-list";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { Button } from "@automotive/shared-ui/ui/button";
import { formatINR } from "@automotive/utilities";
import { allPayoutsQuery, useReleasePayout } from "@/features/settlements/api";

export const Route = createFileRoute("/_portal/settlements")({ component: SettlementsPage });

function SettlementsPage() {
  const payouts = useQuery(allPayoutsQuery());
  const release = useReleasePayout();
  const items = payouts.data ?? [];
  const due = items.filter((p) => p.status !== "paid");
  return (
    <>
      <PageHeading title="Settlements" subtitle="Weekly partner payouts. Commission and TDS are worked out the same way for every partner." />
      <StatGrid
        stats={[
          { label: "To pay out", value: formatINR(due.reduce((s, p) => s + p.netPaise, 0)), tone: "warning", hint: `${due.length} partners` },
          { label: "Commission earned", value: formatINR(items.reduce((s, p) => s + p.commissionPaise, 0)), tone: "success" },
          { label: "TDS withheld", value: formatINR(items.reduce((s, p) => s + p.tdsPaise, 0)), hint: "Section 194-O" },
          { label: "On hold", value: String(items.filter((p) => p.status === "on_hold").length), tone: "danger" },
        ]}
      />
      <section className="mt-6">
        {payouts.isPending ? <ListSkeleton /> : (
          <PayoutList
            payouts={items}
            showVendor
            action={(p) => p.status !== "paid" && (
              <Can permission="refunds:approve"><Button size="sm" disabled={release.isPending} onClick={() => release.mutate(p.id)}>Release</Button></Can>
            )}
          />
        )}
      </section>
    </>
  );
}
