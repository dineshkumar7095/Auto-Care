import type { Product } from "@automotive/shared-types";
import type { StatusTone } from "@automotive/shared-ui/domain/status-badge";

export const LOW_STOCK_AT = 5;
export const listingStatus: Record<Product["listingStatus"], { label: string; tone: StatusTone }> = {
  live: { label: "Live", tone: "success" },
  pending_review: { label: "Pending review", tone: "warning" },
  paused: { label: "Paused", tone: "neutral" },
};
export const isLowStock = (p: Pick<Product, "stock">) => p.stock <= LOW_STOCK_AT;
