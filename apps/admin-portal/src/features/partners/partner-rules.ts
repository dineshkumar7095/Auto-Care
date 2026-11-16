import type { Vendor } from "@automotive/shared-types";
import type { StatusTone } from "@automotive/shared-ui/domain/status-badge";

export const riskTone: Record<Vendor["risk"], StatusTone> = { low: "success", medium: "warning", high: "danger" };
export const VENDOR_TYPE_LABEL: Record<Vendor["type"], string> = { seller: "Seller", distributor: "Distributor", workshop: "Workshop", towing: "Towing partner", brand: "Brand" };
/** Approval unlocks only when every submitted document is verified. Backend enforces the same rule. */
export const canApprove = (v: Pick<Vendor, "documents">) => v.documents.every((d) => d.verified);
