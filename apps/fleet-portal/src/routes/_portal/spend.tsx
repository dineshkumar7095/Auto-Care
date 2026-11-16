import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { StatGrid } from "@automotive/shared-ui/domain/stat-card";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@automotive/shared-ui/ui/chart";
import { formatINR } from "@automotive/utilities";
import { fleetSpendQuery } from "@/features/spend/api";

export const Route = createFileRoute("/_portal/spend")({ component: SpendPage });

const config = {
  parts: { label: "Parts", color: "var(--chart-1)" },
  service: { label: "Service", color: "var(--chart-2)" },
  towing: { label: "Towing", color: "var(--chart-3)" },
} satisfies ChartConfig;

function SpendPage() {
  const spend = useQuery(fleetSpendQuery());
  const rows = spend.data ?? [];
  const total = (k: "partsPaise" | "servicePaise" | "towingPaise") => rows.reduce((s, m) => s + m[k], 0);
  const data = rows.map((m) => ({ month: m.month, parts: m.partsPaise / 100_000, service: m.servicePaise / 100_000, towing: m.towingPaise / 100_000 }));
  return (
    <>
      <PageHeading title="Spend & invoices" subtitle="Last six months across parts, service and towing (₹ lakh)." />
      {spend.isPending ? <ListSkeleton /> : (
        <>
          <StatGrid
            stats={[
              { label: "Parts", value: formatINR(total("partsPaise")) },
              { label: "Service", value: formatINR(total("servicePaise")) },
              { label: "Towing", value: formatINR(total("towingPaise")) },
              { label: "Total", value: formatINR(total("partsPaise") + total("servicePaise") + total("towingPaise")), tone: "success", hint: "GST invoices on every order" },
            ]}
          />
          <section className="surface mt-6 min-w-0 p-4">
            <ChartContainer config={config} className="h-72 w-full">
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="parts" stackId="a" fill="var(--color-parts)" />
                <Bar dataKey="service" stackId="a" fill="var(--color-service)" />
                <Bar dataKey="towing" stackId="a" fill="var(--color-towing)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </section>
        </>
      )}
    </>
  );
}
