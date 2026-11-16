import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { rfqsQuery } from "@/features/rfqs/api";
import { RfqCard } from "@/features/rfqs/components/rfq-card";

export const Route = createFileRoute("/_portal/rfqs")({ component: RfqsPage });

function RfqsPage() {
  const rfqs = useQuery(rfqsQuery());
  const items = rfqs.data ?? [];
  const open = items.filter((r) => r.status === "open");
  const rest = items.filter((r) => r.status !== "open");
  return (
    <>
      <PageHeading title="Quotes (RFQ)" subtitle="Bulk price requests from retailers, workshops and fleets." />
      {rfqs.isPending ? <ListSkeleton /> : items.length === 0 ? <EmptyState title="No requests yet" /> : (
        <>
          <h2 className="mb-3 text-lg font-semibold">Needs your quote ({open.length})</h2>
          <div className="grid gap-3 md:grid-cols-2">{open.map((r) => <RfqCard key={r.id} rfq={r} />)}</div>
          <h2 className="mb-3 mt-8 text-lg font-semibold">Earlier requests</h2>
          <div className="grid gap-3 md:grid-cols-2">{rest.map((r) => <RfqCard key={r.id} rfq={r} />)}</div>
        </>
      )}
    </>
  );
}
