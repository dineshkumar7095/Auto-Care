import type { DashboardStat } from "@automotive/shared-types";
import { cn } from "../../lib/cn";

export function StatCard({ label, value, hint, tone = "default" }: DashboardStat) {
  return (
    <div className="surface p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
      {hint && (
        <p
          className={cn(
            "mt-1 text-xs",
            tone === "success" && "text-success",
            tone === "warning" && "text-warning-foreground",
            tone === "danger" && "text-destructive",
            tone === "default" && "text-muted-foreground",
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export function StatGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
