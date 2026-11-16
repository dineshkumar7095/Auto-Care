import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { pendingPartnersQuery } from "@/features/partners/api";
import { DecisionDialog, type PendingDecision } from "@/features/partners/components/decision-dialog";
import { PartnerCard } from "@/features/partners/components/partner-card";

export const Route = createFileRoute("/_portal/partners")({ component: PartnersPage });

function PartnersPage() {
  const partners = useQuery(pendingPartnersQuery());
  const [pending, setPending] = useState<PendingDecision>(null);
  return (
    <>
      <PageHeading title="Partner approvals" subtitle={`${partners.data?.length ?? 0} applications waiting · every decision is logged`} />
      {partners.isPending ? (
        <ListSkeleton />
      ) : partners.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {partners.data.map((v) => (
            <PartnerCard key={v.id} vendor={v} onDecide={(decision) => setPending({ id: v.id, name: v.name, decision })} />
          ))}
        </div>
      ) : (
        <EmptyState title="All caught up" description="No applications waiting." />
      )}
      <DecisionDialog pending={pending} onClose={() => setPending(null)} />
    </>
  );
}
