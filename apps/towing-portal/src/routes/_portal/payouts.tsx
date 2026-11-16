import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { PayoutList } from "@automotive/shared-ui/domain/payout-list";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { myPayoutsQuery } from "@/features/payouts/api";

export const Route = createFileRoute("/_portal/payouts")({ component: PayoutsPage });

function PayoutsPage() {
  const payouts = useQuery(myPayoutsQuery());
  return (
    <>
      <PageHeading title="Payouts" subtitle="Weekly settlements after platform commission and TDS." />
      {payouts.isPending ? <ListSkeleton /> : payouts.isError ? <ErrorState message={payouts.error.message} /> : payouts.data.length ? <PayoutList payouts={payouts.data} /> : <EmptyState title="No payouts yet" />}
    </>
  );
}
