import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, BadgeCheck, Info, MapPin, Package, RotateCcw, ShieldCheck, Star, Store, Truck } from "lucide-react";
import { FitmentBadge } from "@automotive/shared-ui/domain/fitment-badge";
import { EmptyState, ListSkeleton } from "@automotive/shared-ui/domain/states";
import { usePageTitle } from "@automotive/shared-ui/lib/use-page-title";
import { Badge } from "@automotive/shared-ui/ui/badge";
import { Button } from "@automotive/shared-ui/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@automotive/shared-ui/ui/tabs";
import { formatINR } from "@automotive/utilities";
import { productQuery } from "@/features/catalogue/api";
import { ReviewsSection } from "@/features/reviews/components/reviews-section";
import { defaultVehicle } from "@/features/vehicles/saved-vehicles";

export const Route = createFileRoute("/_site/parts/$id")({ component: ProductPage });

const FIT_COPY = {
  verified: "Matched against the manufacturer catalogue for this model and year.",
  "seller-confirmed": "The seller says this fits. Not yet checked against a catalogue.",
  possible: "We couldn't confirm this fits. Check the part number before buying.",
  "not-verified": "We couldn't confirm this fits. Check the part number before buying.",
} as const;

function ProductPage() {
  const { id } = Route.useParams();
  const query = useQuery(productQuery(id));
  usePageTitle(query.data ? `${query.data.product.title} — Dono Auto Care` : "Part — Dono Auto Care");
  if (query.isPending) return <div className="mx-auto max-w-7xl px-4 py-6"><ListSkeleton rows={6} /></div>;
  if (query.isError) return <div className="mx-auto max-w-md px-4 py-20"><EmptyState title="This part isn't listed" action={<Link to="/parts" className="text-accent underline">Back to spare parts</Link>} /></div>;
  const { product: p, offers } = query.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link to="/parts" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Spare parts</Link>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1fr_1fr_340px] lg:gap-8">
        <div className="grid aspect-square place-items-center rounded-2xl bg-muted"><Package className="size-28 text-primary/20" strokeWidth={1} /></div>
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap gap-2"><Badge variant="outline">{p.partClass}</Badge><Badge variant="muted">{p.category}</Badge></div>
          <div>
            <p className="text-sm text-muted-foreground">{p.brand}</p>
            <h1 className="text-2xl font-semibold md:text-3xl">{p.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Part no. <span className="font-mono text-foreground">{p.partNumber}</span></p>
          </div>
          <p className="flex items-center gap-1 text-sm"><Star className="size-4 fill-warning text-warning" /> <b>{p.rating}</b> <span className="text-muted-foreground">· {p.reviews} reviews</span></p>
          <div className="rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compatibility</p>
            <p className="mt-2 text-sm font-medium">{defaultVehicle.label}</p>
            <div className="mt-2"><FitmentBadge fitment={p.fitment} /></div>
            <p className="mt-2 flex gap-1.5 text-xs text-muted-foreground"><Info className="mt-0.5 size-3.5 shrink-0" /> {FIT_COPY[p.fitment]}</p>
          </div>
          <Tabs defaultValue="specs">
            <TabsList><TabsTrigger value="specs">Specifications</TabsTrigger><TabsTrigger value="policy">Warranty & returns</TabsTrigger></TabsList>
            <TabsContent value="specs">
              <dl className="divide-y rounded-xl border text-sm">
                {Object.entries(p.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 px-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                ))}
              </dl>
            </TabsContent>
            <TabsContent value="policy" className="space-y-2 text-sm">
              <p className="flex gap-2"><ShieldCheck className="size-4 shrink-0 text-success" /> Warranty: {p.warranty}</p>
              <p className="flex gap-2"><RotateCcw className="size-4 shrink-0 text-success" /> {p.returnable ? "7-day return if unused and in original packaging" : "Not returnable once fitted; replacement under warranty only"}</p>
            </TabsContent>
          </Tabs>
        </div>
        <aside className="surface h-fit space-y-4 p-5 md:col-span-2 lg:sticky lg:top-28 lg:col-span-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold">{formatINR(p.pricePaise)}</span>
            <span className="text-sm text-muted-foreground line-through">{formatINR(p.mrpPaise)}</span>
          </div>
          <p className="-mt-3 text-xs text-muted-foreground">Inclusive of {p.gstRatePct}% GST</p>
          <p className="flex items-center gap-2 text-sm"><Truck className="size-4 shrink-0 text-accent" /> {p.delivery}</p>
          <p className="text-sm font-medium text-success">{p.stock > 5 ? "In stock" : `Only ${p.stock} left`}</p>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="flex items-center gap-1.5 font-medium"><Store className="size-4 shrink-0" /> {p.sellerName} {p.sellerVerified && <BadgeCheck className="size-4 text-success" />}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {p.sellerCity}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <Button size="xl" onClick={() => toast.success("Added to cart", { description: p.title })}>Add to cart</Button>
            <Button size="xl" variant="soft" onClick={() => toast("Checkout comes next", { description: "Payments are not connected yet." })}>Buy now</Button>
          </div>
        </aside>
      </div>
      {offers.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-semibold">Other sellers for this part</h2>
          <div className="divide-y rounded-xl border bg-card">
            {offers.map((o) => (
              <div key={o.vendorId} className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 p-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold">{o.sellerName} {o.verified && <BadgeCheck className="size-4 shrink-0 text-success" />}</p>
                  <p className="truncate text-xs text-muted-foreground">{o.delivery} · ★ {o.rating}</p>
                </div>
                <span className="font-display font-semibold">{formatINR(o.pricePaise)}</span>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Added from ${o.sellerName}`)}>Add</Button>
              </div>
            ))}
          </div>
        </section>
      )}
      <ReviewsSection productId={p.id} />
    </div>
  );
}
