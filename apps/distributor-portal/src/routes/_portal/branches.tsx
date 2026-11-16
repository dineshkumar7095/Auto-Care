import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Can } from "@automotive/authentication";
import { isLowStock, type BranchStock } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { EmptyState, ErrorState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { StatusBadge } from "@automotive/shared-ui/domain/status-badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { Input } from "@automotive/shared-ui/ui/input";
import { branchStockQuery, useSetBranchStock } from "@/features/branches/api";

export const Route = createFileRoute("/_portal/branches")({ component: BranchesPage });

function BranchesPage() {
  const stock = useQuery(branchStockQuery());
  const branches = [...new Set((stock.data ?? []).map((s) => s.branch))];
  const low = (stock.data ?? []).filter(isLowStock).length;
  return (
    <>
      <PageHeading title="Branches & stock" subtitle={low ? `${low} part${low === 1 ? "" : "s"} at or below reorder level.` : "Stock at each warehouse."} />
      {stock.isPending ? <ListSkeleton /> : stock.isError ? <ErrorState message={stock.error.message} /> : !branches.length ? <EmptyState title="No branches yet" /> : (
        <div className="space-y-5">
          {branches.map((b) => (
            <section key={b} className="space-y-2">
              <h2 className="font-display text-base font-semibold">{b}</h2>
              <ul className="divide-y rounded-xl border bg-card">
                {stock.data.filter((s) => s.branch === b).map((s) => <StockRow key={s.id} line={s} />)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function StockRow({ line }: { line: BranchStock }) {
  const [value, setValue] = useState(line.onHand);
  const save = useSetBranchStock();
  return (
    <li className="flex flex-wrap items-center gap-3 p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{line.title}</p>
        <p className="truncate text-xs text-muted-foreground">{line.partNumber} · reorder at {line.reorderLevel}</p>
      </div>
      <StatusBadge label={isLowStock(line) ? "Reorder" : "In stock"} tone={isLowStock(line) ? "danger" : "success"} />
      <Can permission="catalogue:write" fallback={<span className="text-sm font-semibold">{line.onHand}</span>}>
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); save.mutate({ id: line.id, onHand: value }); }}>
          <Input aria-label={`Units of ${line.title} at ${line.branch}`} type="number" min={0} className="w-24" value={value} onChange={(e) => setValue(e.target.valueAsNumber || 0)} />
          <Button size="sm" variant="outline" type="submit" disabled={save.isPending || value === line.onHand}>Update</Button>
        </form>
      </Can>
    </li>
  );
}
