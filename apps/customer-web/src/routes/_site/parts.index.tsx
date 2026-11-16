import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Car, SlidersHorizontal, X } from "lucide-react";
import { PART_CATEGORIES } from "@automotive/shared-types";
import { EmptyState } from "@automotive/shared-ui/domain/states";
import { cn } from "@automotive/shared-ui/lib/cn";
import { usePageTitle } from "@automotive/shared-ui/lib/use-page-title";
import { Label } from "@automotive/shared-ui/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@automotive/shared-ui/ui/select";
import { Switch } from "@automotive/shared-ui/ui/switch";
import { productsQuery } from "@/features/catalogue/api";
import { ProductGrid } from "@/features/catalogue/components/product-grid";
import { savedVehicles } from "@/features/vehicles/saved-vehicles";

type Sort = "fit" | "price-asc" | "price-desc" | "rating";
type PartsSearch = { q?: string | undefined; category?: string | undefined; vehicle?: string | undefined; verified?: boolean | undefined; sort?: Sort | undefined };
const SORTS: Sort[] = ["fit", "price-asc", "price-desc", "rating"];

/** Filters live in the URL so results are shareable and survive refresh. */
export const Route = createFileRoute("/_site/parts/")({
  validateSearch: (s: Record<string, unknown>): PartsSearch => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    category: typeof s["category"] === "string" && s["category"] ? s["category"] : undefined,
    vehicle: typeof s["vehicle"] === "string" ? s["vehicle"] : undefined,
    verified: s["verified"] === true || s["verified"] === "true" ? true : undefined,
    sort: SORTS.includes(s["sort"] as Sort) ? (s["sort"] as Sort) : undefined,
  }),
  component: PartsPage,
});

function PartsPage() {
  usePageTitle("Spare parts that fit — Dono Auto Care");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const sort = search.sort ?? "fit";
  const results = useQuery(productsQuery({ q: search.q, category: search.category, verifiedOnly: search.verified, sort }));
  const vehicle = savedVehicles.find((v) => v.id === (search.vehicle ?? "v1"));
  const items = results.data?.items ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-start gap-2 rounded-xl bg-primary-soft p-3 text-sm">
        <Car className="mt-0.5 size-4 shrink-0 text-primary" />
        {vehicle && search.vehicle !== "none" ? <span>Showing fitment for <b>{vehicle.label}</b> · {vehicle.reg}</span> : <span>Searching without a vehicle — fitment can't be checked.</span>}
      </div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="truncate text-2xl font-semibold">{search.q ? `Results for “${search.q}”` : (search.category ?? "All spare parts")}</h1>
        <p className="text-sm text-muted-foreground">{items.length} items</p>
      </div>
      <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        {[undefined, ...PART_CATEGORIES].map((c) => (
          <button
            key={c ?? "all"}
            onClick={() => void navigate({ search: (s) => ({ ...s, category: c }) })}
            className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium", search.category === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}
          >
            {c ?? "All"}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 border-y py-3">
        <span className="flex items-center gap-1.5 text-sm font-medium"><SlidersHorizontal className="size-4" /> Filters</span>
        <div className="flex items-center gap-2">
          <Switch id="vf" checked={!!search.verified} onCheckedChange={(v) => void navigate({ search: (s) => ({ ...s, verified: v || undefined }) })} />
          <Label htmlFor="vf">Verified fit only</Label>
        </div>
        {search.q && (
          <button onClick={() => void navigate({ search: (s) => ({ ...s, q: undefined }) })} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">“{search.q}” <X className="size-3" /></button>
        )}
        <div className="w-full sm:ml-auto sm:w-auto">
          <Select value={sort} onValueChange={(v) => void navigate({ search: (s) => ({ ...s, sort: v as Sort }) })}>
            <SelectTrigger className="h-9 w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fit">Best fit first</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-5">
        {results.isPending || items.length ? (
          <ProductGrid products={items} loading={results.isPending} />
        ) : (
          <EmptyState title="No parts match these filters" description="Try a different part number or clear the filters." action={<Link to="/parts" className="text-sm font-medium text-accent underline">Clear all</Link>} />
        )}
      </div>
    </div>
  );
}
