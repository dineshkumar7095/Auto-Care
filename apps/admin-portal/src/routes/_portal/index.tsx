import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { formatINR } from "@automotive/utilities";
import { overviewQuery } from "@/features/overview/api";
import { AlertsList } from "@/features/overview/components/alerts-list";
import { ValueChart } from "@/features/overview/components/value-chart";

export const Route = createFileRoute("/_portal/")({ component: AdminDashboard });

function AdminDashboard() {
  const overview = useQuery(overviewQuery());
  if (overview.isPending) return <ListSkeleton rows={6} />;
  if (overview.isError) return <ErrorState message={overview.error.message} onRetry={() => void overview.refetch()} />;
  const o = overview.data;
  return (
    <>
      <PageHeading title="Marketplace overview" subtitle="Hyderabad pilot · last 7 days" />
      <StatGrid
        stats={[
          { label: "Gross order value", value: formatINR(o.grossValuePaise), hint: "+12% week on week", tone: "success" },
          { label: "Orders · bookings · trips", value: (o.counts.orders + o.counts.bookings + o.counts.trips).toLocaleString("en-IN"), hint: `${o.counts.orders} · ${o.counts.bookings} · ${o.counts.trips}` },
          { label: "Active partners", value: String(o.activePartners), hint: `${o.pendingPartners} awaiting approval`, tone: "warning" },
          { label: "Open disputes", value: String(o.openDisputes), hint: "3 older than 48 h", tone: "danger" },
        ]}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="surface min-w-0 p-5">
          <h2 className="text-lg font-semibold">Daily value by line (₹ lakh)</h2>
          <ValueChart data={o.weekly} />
        </section>
        <section className="surface p-5">
          <h2 className="text-lg font-semibold">Alerts</h2>
          <AlertsList alerts={o.alerts} />
        </section>
      </div>
    </>
  );
}
