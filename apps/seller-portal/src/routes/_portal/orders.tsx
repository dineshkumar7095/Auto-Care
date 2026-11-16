import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { OrderStatus } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { Tabs, TabsList, TabsTrigger } from "@automotive/shared-ui/ui/tabs";
import { vendorOrdersQuery } from "@/features/orders/api";
import { OrdersTable } from "@/features/orders/components/orders-table";

const TABS: Record<string, (s: OrderStatus) => boolean> = {
  all: () => true,
  open: (s) => s === "placed" || s === "accepted" || s === "packed",
  returns: (s) => s === "return_requested",
};

export const Route = createFileRoute("/_portal/orders")({ component: OrdersPage });

function OrdersPage() {
  const [tab, setTab] = useState("all");
  const orders = useQuery(vendorOrdersQuery());
  const shown = orders.data?.filter((o) => TABS[tab]!(o.status)) ?? [];
  return (
    <>
      <PageHeading title="Orders" subtitle="Retail (B2C) and trade (B2B) orders across your branches." />
      <Tabs value={tab} onValueChange={setTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">To fulfil</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>
      </Tabs>
      {orders.isPending ? <ListSkeleton /> : orders.isError ? <ErrorState message={orders.error.message} onRetry={() => void orders.refetch()} /> : shown.length ? <OrdersTable orders={shown} /> : <EmptyState title="Nothing here right now" />}
    </>
  );
}
