import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@automotive/authentication";
import { BUYER_GROUP_LABEL, hasPermission } from "@automotive/shared-types";
import { PageHeading } from "@automotive/shared-ui/domain/page-heading";
import { ListSkeleton } from "@automotive/shared-ui/domain/states";
import { Switch } from "@automotive/shared-ui/ui/switch";
import { applyDiscountPct, formatINR } from "@automotive/utilities";
import { priceListsQuery, useTogglePriceList } from "@/features/price-lists/api";

export const Route = createFileRoute("/_portal/price-lists")({ component: PriceListsPage });

const EXAMPLE_LIST_PAISE = 189900; // a Bosch brake pad set, to show what each tier pays

function PriceListsPage() {
  const lists = useQuery(priceListsQuery());
  const toggle = useTogglePriceList();
  const { user } = useAuth();
  const canEdit = !!user && hasPermission(user.roles, "catalogue:write");
  return (
    <>
      <PageHeading title="Price lists" subtitle="Trade discounts for each buyer group. Buyers only see the list for their group." />
      {lists.isPending ? <ListSkeleton /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {lists.data?.map((p) => (
            <article key={p.id} className="surface flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">{BUYER_GROUP_LABEL[p.buyerGroup]} · {p.skuCount.toLocaleString("en-IN")} parts</p>
                  <h3 className="truncate font-sans text-base font-semibold">{p.name}</h3>
                </div>
                <Switch checked={p.active} disabled={!canEdit || toggle.isPending} onCheckedChange={(active) => toggle.mutate({ id: p.id, active })} aria-label={`Turn ${p.name} on or off`} />
              </div>
              <dl className="grid grid-cols-3 gap-2 text-sm">
                <div><dt className="text-xs text-muted-foreground">Discount</dt><dd className="font-semibold">{p.discountPct}%</dd></div>
                <div><dt className="text-xs text-muted-foreground">Min. order</dt><dd className="font-semibold">{formatINR(p.minOrderPaise)}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Pads at</dt><dd className="font-semibold">{formatINR(applyDiscountPct(EXAMPLE_LIST_PAISE, p.discountPct))}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
