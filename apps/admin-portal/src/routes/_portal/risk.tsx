import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { api } from "@automotive/api-client";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { formatDate } from "@automotive/utilities";

export const Route = createFileRoute("/_portal/risk")({ component: RiskPage });

const flaggedPartnersQuery = () => queryOptions({ queryKey: ["vendors", "all"], queryFn: () => api.vendors.list() });

function RiskPage() {
  const vendors = useQuery(flaggedPartnersQuery());
  const flagged = (vendors.data ?? []).filter((v) => v.risk !== "low" || v.documents.some((d) => !d.verified));
  return (
    <>
      <PageHeading title="Risk & fraud" subtitle="Partners with a medium or high risk score, or documents not yet verified." />
      {vendors.isPending ? <ListSkeleton /> : vendors.isError ? <ErrorState message={vendors.error.message} /> : !flagged.length ? <EmptyState title="Nothing flagged" /> : (
        <ul className="divide-y rounded-xl border bg-card">
          {flagged.map((v) => {
            const missing = v.documents.filter((d) => !d.verified).map((d) => d.label);
            return (
              <li key={v.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.type} · {v.city} · applied {formatDate(v.submittedAt)}{missing.length ? ` · not verified: ${missing.join(", ")}` : ""}</p>
                </div>
                <StatusBadge label={`${v.risk[0]!.toUpperCase()}${v.risk.slice(1)} risk`} tone={v.risk === "high" ? "danger" : v.risk === "medium" ? "warning" : "neutral"} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
