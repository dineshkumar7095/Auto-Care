import type { Product } from "@automotive/shared-types";
import { Skeleton } from "@automotive/shared-ui/ui/skeleton";
import { ProductCard } from "./product-card";

export function ProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {loading ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />) : products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
