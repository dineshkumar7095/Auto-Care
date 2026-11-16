import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { tradeOrdersQuery } from "@/features/trade-orders/api";
import { TradeOrderList } from "@/features/trade-orders/components/trade-order-list";

export const Route = createFileRoute("/_portal/orders")({ component: TradeOrdersPage });

function TradeOrdersPage() {
  const orders = useQuery(tradeOrdersQuery());
  return (
    <>
      <PageHeading title="Trade orders" subtitle="Every bulk order, newest first." />
      {orders.isPending ? <ListSkeleton /> : orders.data?.length ? <TradeOrderList orders={orders.data} /> : <EmptyState title="No trade orders yet" />}
    </>
  );
}
