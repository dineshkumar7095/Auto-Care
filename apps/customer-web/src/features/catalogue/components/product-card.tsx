import { Link } from "@tanstack/react-router";
import { Package, Star, Truck } from "lucide-react";
import type { Product } from "@automotive/shared-types";
import { FitmentBadge } from "@automotive/shared-ui/domain/fitment-badge";
import { Badge } from "@automotive/shared-ui/ui/badge";
import { discountPct, formatINR } from "@automotive/utilities";

export function ProductCard({ product: p }: { product: Product }) {
  return (
    <Link to="/parts/$id" params={{ id: p.id }} className="surface group flex min-w-0 flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative grid aspect-[4/3] place-items-center bg-muted">
        <Package className="size-12 text-primary/25 transition-transform group-hover:scale-110" strokeWidth={1.25} />
        <Badge variant="outline" className="absolute left-3 top-3 bg-card text-[11px]">{p.partClass}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <FitmentBadge fitment={p.fitment} />
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{p.brand} · {p.partNumber}</p>
          <h3 className="mt-0.5 line-clamp-2 font-sans text-sm font-semibold">{p.title}</h3>
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="size-3.5 fill-warning text-warning" /> {p.rating} ({p.reviews})</p>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="font-display text-lg font-semibold">{formatINR(p.pricePaise)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatINR(p.mrpPaise)}</span>
          <span className="text-xs font-semibold text-success">{discountPct(p.pricePaise, p.mrpPaise)}% off</span>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Truck className="size-3.5 shrink-0" /> <span className="truncate">{p.delivery}</span></p>
      </div>
    </Link>
  );
}
