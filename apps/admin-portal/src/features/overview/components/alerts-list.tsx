import { AlertTriangle, Info } from "lucide-react";
import type { AdminOverview } from "@automotive/api-client";
import { cn } from "@automotive/shared-ui/lib/cn";

export function AlertsList({ alerts }: { alerts: AdminOverview["alerts"] }) {
  return (
    <ul className="mt-3 space-y-2">
      {alerts.map((a) => (
        <li
          key={a.text}
          className={cn(
            "flex gap-2 rounded-lg p-3 text-sm",
            a.level === "high" && "bg-destructive-soft text-destructive",
            a.level === "medium" && "bg-warning-soft text-warning-foreground",
            a.level === "low" && "bg-info-soft text-accent",
          )}
        >
          {a.level === "low" ? <Info className="mt-0.5 size-4 shrink-0" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0" />}
          {a.text}
        </li>
      ))}
    </ul>
  );
}
