import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { formatINR } from "@automotive/utilities";
import { creditQuery } from "@/features/credit/api";
import { rfqsQuery } from "@/features/rfqs/api";
import { tradeOrdersQuery } from "@/features/trade-orders/api";
import { TradeOrderList } from "@/features/trade-orders/components/trade-order-list";

export const Route = createFileRoute("/_portal/")({ component: DistributorDashboard });

function DistributorDashboard() {
  const orders = useQuery(tradeOrdersQuery());
  const rfqs = useQuery(rfqsQuery());
  const credit = useQuery(creditQuery());
  const openRfqs = rfqs.data?.filter((r) => r.status === "open").length ?? 0;
  const outstanding = credit.data?.reduce((s, a) => s + a.usedPaise, 0) ?? 0;
  const overLimit = credit.data?.filter((a) => a.usedPaise > a.limitPaise || a.overdueDays > 30).length ?? 0;
  const open = orders.data?.filter((o) => o.status !== "delivered" && o.status !== "cancelled") ?? [];
  return (
    <>
      <PageHeading title="Trade desk" subtitle="Bulk orders from retailers, workshops and fleets." />
      <StatGrid
        stats={[
          { label: "Open trade value", value: formatINR(open.reduce((s, o) => s + o.totals.totalPaise, 0)), tone: "success", hint: "Across all buyers" },
          { label: "Orders to confirm", value: String(open.filter((o) => o.status === "placed").length), tone: "warning", hint: "Confirm within 2 h" },
          { label: "Open RFQs", value: String(openRfqs), hint: "Waiting for your quote", tone: openRfqs ? "warning" : "default" },
          { label: "Credit outstanding", value: formatINR(outstanding), hint: `${overLimit} buyers over limit or on hold`, tone: overLimit ? "danger" : "default" },
        ]}
      />
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Latest trade orders</h2>
          <Link to="/orders" className="flex items-center gap-1 text-sm font-medium text-accent">All <ArrowRight className="size-4" /></Link>
        </div>
        {orders.isPending ? <ListSkeleton /> : <TradeOrderList orders={open} />}
      </section>
    </>
  );
}
