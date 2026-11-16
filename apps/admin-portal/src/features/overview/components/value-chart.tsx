import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { AdminOverview } from "@automotive/api-client";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@automotive/shared-ui/ui/chart";

const config = {
  parts: { label: "Parts", color: "var(--chart-1)" },
  services: { label: "Services", color: "var(--chart-2)" },
  towing: { label: "Towing", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ValueChart({ data }: { data: AdminOverview["weekly"] }) {
  return (
    <ChartContainer config={config} className="mt-4 h-64 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="parts" stackId="a" fill="var(--color-parts)" />
        <Bar dataKey="services" stackId="a" fill="var(--color-services)" />
        <Bar dataKey="towing" stackId="a" fill="var(--color-towing)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
