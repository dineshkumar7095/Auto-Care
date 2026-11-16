import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { Can } from "@automotive/authentication";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { Button } from "@automotive/shared-ui/ui/button";
import { Input } from "@automotive/shared-ui/ui/input";
import { myListingsQuery } from "@/features/products/api";
import { AddProductSheet } from "@/features/products/components/add-product-sheet";
import { ProductsTable } from "@/features/products/components/products-table";

export const Route = createFileRoute("/_portal/products")({ component: ProductsPage });

function ProductsPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const listings = useQuery(myListingsQuery());
  const list = (listings.data ?? []).filter((l) => [l.title, l.partNumber].some((f) => f.toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <PageHeading
        title="Products & stock"
        subtitle={`${listings.data?.length ?? 0} listings`}
        actions={<Can permission="catalogue:write"><Button onClick={() => setOpen(true)}><Plus /> Add product</Button></Can>}
      />
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or part no." className="bg-card pl-9" />
      </div>
      {listings.isPending ? <ListSkeleton /> : list.length ? <ProductsTable products={list} /> : <EmptyState title="No listings match" />}
      <AddProductSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
